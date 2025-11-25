import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Cpu, ArrowRight, Loader2 } from 'lucide-react';
import { TerminalBox, TerminalButton } from './TerminalUI';
import { TableSchema, ColumnDefinition } from '../types';
import { analyzeSchema } from '../services/geminiService';

interface SchemaChecklistProps {
  onConfirm: (schema: TableSchema) => void;
}

// Mock columns simulating a read from the DB
const MOCK_RAW_COLUMNS = [
  'id', 'created_at', 'customer_name', 'email', 'product_sku', 'category', 'quantity', 'unit_price', 'total_amount', 'shipping_region', 'is_returned'
];

export const SchemaChecklist: React.FC<SchemaChecklistProps> = ({ onConfirm }) => {
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const runAnalysis = async () => {
      // Simulate API delay for dramatic effect
      await new Promise(r => setTimeout(r, 1000));
      const result = await analyzeSchema(MOCK_RAW_COLUMNS);
      setColumns(result);
      setIsAnalyzing(false);
    };
    runAnalysis();
  }, []);

  const toggleConfirm = (idx: number) => {
    const newCols = [...columns];
    newCols[idx].isConfirmed = !newCols[idx].isConfirmed;
    setColumns(newCols);
  };

  const handleApprove = () => {
    onConfirm({
      tableName: 'public.orders',
      columns: columns.filter(c => c.isConfirmed)
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 w-full h-full flex flex-col">
      <div className="mb-8 flex items-end justify-between border-b border-nexus-border pb-4">
        <div>
           <h2 className="text-2xl font-mono text-white tracking-tight flex items-center gap-3">
             <Cpu className={`w-6 h-6 text-nexus-green ${isAnalyzing ? 'animate-pulse' : ''}`} />
             SCHEMA RECOGNITION
           </h2>
           <p className="text-nexus-gray text-xs mt-2 uppercase tracking-wider">
             {isAnalyzing ? 'AI Neural Net Analyzing Data Structure...' : 'Review and calibrate system understanding.'}
           </p>
        </div>
        <div className="text-right">
           <div className="text-nexus-green font-mono text-xl font-bold">
             {columns.filter(c => c.isConfirmed).length} / {columns.length}
           </div>
           <div className="text-[10px] text-nexus-gray uppercase">Active Fields</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4 opacity-50">
             <Loader2 className="w-12 h-12 text-nexus-green animate-spin" />
             <div className="font-mono text-xs text-nexus-green animate-pulse">DECODING METADATA STREAMS...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {columns.map((col, idx) => (
              <div 
                key={col.name} 
                onClick={() => toggleConfirm(idx)}
                className={`group flex items-center p-4 border cursor-pointer transition-all duration-200 ${
                  col.isConfirmed 
                    ? 'border-nexus-green/30 bg-nexus-green/5' 
                    : 'border-nexus-border opacity-60 hover:opacity-100 hover:border-nexus-gray'
                }`}
              >
                <div className="mr-4">
                  {col.isConfirmed ? (
                    <CheckCircle2 className="w-5 h-5 text-nexus-green" />
                  ) : (
                    <div className="w-5 h-5 rounded-none border border-nexus-gray group-hover:border-nexus-green" />
                  )}
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <div className="text-[10px] text-nexus-gray uppercase tracking-widest mb-1">Column Name</div>
                    <div className="font-mono text-sm text-white font-bold">{col.name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-nexus-gray uppercase tracking-widest mb-1">Detected Type</div>
                    <div className="font-mono text-xs text-nexus-green bg-nexus-green/10 inline-block px-2 py-1">
                      {col.type}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-nexus-gray uppercase tracking-widest mb-1">Business Semantics</div>
                    <div className="font-mono text-xs text-nexus-gray group-hover:text-white truncate">
                      {col.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-nexus-border pt-6 flex justify-end">
        <TerminalButton onClick={handleApprove} disabled={isAnalyzing} className="flex items-center gap-2 group pl-8 pr-8">
           SYSTEM CALIBRATION COMPLETE
           <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </TerminalButton>
      </div>
    </div>
  );
};
