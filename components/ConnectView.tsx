import React, { useState } from 'react';
import { Database, FileSpreadsheet, ArrowRight, ShieldCheck } from 'lucide-react';
import { TerminalBox, TerminalButton, TerminalInput } from './TerminalUI';
import { DataSource } from '../types';

interface ConnectViewProps {
  onConnect: (source: DataSource) => void;
}

export const ConnectView: React.FC<ConnectViewProps> = ({ onConnect }) => {
  const [activeTab, setActiveTab] = useState<'postgres' | 'csv'>('postgres');
  // Default to a placeholder to avoid committing secrets
  const [connectionString, setConnectionString] = useState('postgresql://user:password@localhost:5432/dbname');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    // Simulate connection delay
    setTimeout(() => {
      onConnect({
        type: activeTab === 'postgres' ? 'POSTGRES' : 'CSV',
        connectionString: activeTab === 'postgres' ? connectionString : undefined,
        fileName: activeTab === 'csv' ? 'sales_data_Q3.csv' : undefined
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto px-4">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold font-mono text-white tracking-tight">
          NEXUS <span className="text-nexus-green">//</span> INSIGHT
        </h1>
        <p className="text-nexus-gray font-mono text-sm tracking-widest uppercase max-w-lg mx-auto">
          AI-Driven Data Intelligence Terminal. Connect your source to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Postgres Option */}
        <div onClick={() => setActiveTab('postgres')} className="cursor-pointer">
          <TerminalBox 
            title="Database Connection" 
            active={activeTab === 'postgres'}
            className="h-full flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-nexus-green">
                <Database className="w-8 h-8" />
                <span className="text-lg font-bold tracking-wider">POSTGRESQL</span>
              </div>
              <p className="text-nexus-gray text-xs leading-relaxed">
                Secure direct connection (Read-Only). Optimized for high-throughput queries.
              </p>
              
              <div className={`transition-all duration-300 ${activeTab === 'postgres' ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                <label className="text-[10px] uppercase text-nexus-gray block mb-2">Connection String</label>
                <TerminalInput 
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                  placeholder="postgresql://user:pass@host:port/db"
                  disabled={activeTab !== 'postgres'}
                />
              </div>
            </div>
          </TerminalBox>
        </div>

        {/* CSV Option */}
        <div onClick={() => setActiveTab('csv')} className="cursor-pointer">
          <TerminalBox 
            title="Local Ingestion" 
            active={activeTab === 'csv'}
            className="h-full flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-nexus-green">
                <FileSpreadsheet className="w-8 h-8" />
                <span className="text-lg font-bold tracking-wider">CSV UPLOAD</span>
              </div>
               <p className="text-nexus-gray text-xs leading-relaxed">
                Parsing engine ready for flat files. Auto-detection of delimiters and types.
              </p>
              <div className={`border border-dashed border-nexus-border p-8 text-center transition-all ${activeTab === 'csv' ? 'border-nexus-green/50 bg-nexus-green/5' : ''}`}>
                 <input type="file" className="hidden" id="csv-upload" disabled={activeTab !== 'csv'} />
                 <label htmlFor="csv-upload" className="text-xs text-nexus-gray cursor-pointer hover:text-white uppercase tracking-wider">
                    {activeTab === 'csv' ? '[ Click to Select File ]' : '[ Disabled ]'}
                 </label>
              </div>
            </div>
          </TerminalBox>
        </div>
      </div>

      <div className="mt-12 w-full max-w-md flex flex-col gap-4">
        <TerminalButton onClick={handleConnect} disabled={isLoading} className="w-full flex items-center justify-center gap-2 group">
           {isLoading ? 'ESTABLISHING LINK...' : 'INITIALIZE SYSTEM'}
           {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </TerminalButton>
        
        <div className="flex items-center justify-center gap-2 text-nexus-gray/50 text-[10px] uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          <span>Secure Read-Only Protocol Active</span>
        </div>
      </div>
    </div>
  );
};