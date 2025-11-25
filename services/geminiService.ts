import { GoogleGenAI, Type } from "@google/genai";
import { TableSchema, ColumnDefinition, ChartData } from "../types";

// SECURITY: API Key is loaded from environment variables.
// Ensure process.env.API_KEY is set in your build/runtime environment.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FAST = 'gemini-2.5-flash';

export const analyzeSchema = async (rawColumns: string[]): Promise<ColumnDefinition[]> => {
  const ai = getAI();

  const prompt = `
    You are a database expert. Analyze this list of column names from a dataset:
    ${JSON.stringify(rawColumns)}

    For each column, provide:
    1. A likely SQL data type (VARCHAR, INTEGER, BOOLEAN, DATE, etc.).
    2. A short, professional business description (max 10 words).

    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              type: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ['name', 'type', 'description']
          }
        }
      }
    });

    const text = response.text;
    if (!text) return rawColumns.map(c => ({ name: c, type: 'UNKNOWN', description: 'Pending analysis', isConfirmed: false }));

    const parsed = JSON.parse(text);
    return parsed.map((item: any) => ({ ...item, isConfirmed: true }));

  } catch (error) {
    console.error("Gemini Schema Analysis Failed:", error);
    // Fallback
    return rawColumns.map(c => ({ name: c, type: 'VARCHAR', description: 'Auto-generated', isConfirmed: false }));
  }
};

export const generateQueryAndChartConfig = async (
  userQuery: string,
  schema: TableSchema
): Promise<{ sql: string; chartConfig: Omit<ChartData, 'data'>; explanation: string }> => {
  const ai = getAI();

  const schemaContext = schema.columns.map(c => `${c.name} (${c.type}): ${c.description}`).join('\n');

  const prompt = `
    Context: A user is querying a dataset with the following schema:
    ${schemaContext}

    User Query: "${userQuery}"

    Task:
    1. Translate the user query into a standard PostgreSQL SELECT statement.
    2. Decide the best visualization type (bar, line, pie, area).
    3. Determine the X-axis key and data keys for the chart.
    4. Provide a very brief explanation.

    IMPORTANT: Return valid JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sql: { type: Type.STRING },
            chartType: { type: Type.STRING, description: "One of: bar, line, pie, area" },
            xAxisKey: { type: Type.STRING },
            dataKeys: { type: Type.ARRAY, items: { type: Type.STRING } },
            title: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ['sql', 'chartType', 'xAxisKey', 'dataKeys', 'title', 'explanation']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);
    
    // Normalize chart type to ensure it matches the union type
    let chartType = result.chartType.toLowerCase();
    if (!['bar', 'line', 'pie', 'area'].includes(chartType)) {
      chartType = 'bar'; // Default fallback if model hallucinates a type
    }

    return {
      sql: result.sql,
      explanation: result.explanation,
      chartConfig: {
        type: chartType as any,
        title: result.title,
        xAxisKey: result.xAxisKey,
        dataKeys: result.dataKeys
      }
    };

  } catch (error) {
    console.error("Gemini Query Generation Failed:", error);
    throw error;
  }
};