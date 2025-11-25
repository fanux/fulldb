import React from 'react';
import { GridBackground } from './components/TerminalUI';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen text-nexus-gray font-mono selection:bg-nexus-green selection:text-black">
      <GridBackground />
      
      <header className="fixed top-0 left-0 right-0 h-10 border-b border-nexus-border bg-nexus-black/90 backdrop-blur-sm z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
           <div className="w-2 h-2 bg-nexus-green animate-pulse rounded-none"></div>
           <span className="text-xs font-bold text-white tracking-[0.2em]">NEXUS // INSIGHT</span>
        </div>
        <div className="text-[10px] flex gap-4">
           <span className="hover:text-nexus-green cursor-pointer">SYS.STATUS: ONLINE</span>
           <span className="hover:text-nexus-green cursor-pointer">LATENCY: 12ms</span>
           <span className="hover:text-nexus-green cursor-pointer">BUILD: v0.9.1a</span>
        </div>
      </header>

      <main className="pt-10 h-screen overflow-hidden">
        {children}
      </main>

      {/* Decorative scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
      <div className="fixed inset-0 pointer-events-none z-[101] bg-gradient-to-b from-transparent via-transparent to-nexus-black/20"></div>
    </div>
  );
};
