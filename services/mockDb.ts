import { ChartData } from "../types";

// Since we cannot connect to a real Postgres DB from the browser due to TCP/CORS limitations,
// we simulate the data return based on the chart configuration requested by the AI.

export const mockExecuteQuery = async (chartConfig: Omit<ChartData, 'data'>): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = [];
      const count = 7; // e.g., last 7 days or 7 categories

      for (let i = 0; i < count; i++) {
        const item: any = {};
        
        // Mock X Axis
        if (chartConfig.xAxisKey.toLowerCase().includes('date') || chartConfig.xAxisKey.toLowerCase().includes('day')) {
           const d = new Date();
           d.setDate(d.getDate() - (count - i));
           item[chartConfig.xAxisKey] = d.toISOString().split('T')[0];
        } else {
           item[chartConfig.xAxisKey] = `Category ${String.fromCharCode(65 + i)}`;
        }

        // Mock Data Keys
        chartConfig.dataKeys.forEach(key => {
          item[key] = Math.floor(Math.random() * 500) + 100;
        });

        data.push(item);
      }
      resolve(data);
    }, 800); // Simulate network latency
  });
};
