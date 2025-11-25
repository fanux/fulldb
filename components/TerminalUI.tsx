import React from 'react';

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  active?: boolean;
}

export const TerminalBox: React.FC<BoxProps> = ({ children, className = '', title, active }) => {
  return (
    <div className={`group relative bg-nexus-surface/50 backdrop-blur-sm border transition-all duration-300 ${active ? 'border-nexus-green shadow-[0_0_10px_rgba(0,255,65,0.1)]' : 'border-nexus-border hover:border-nexus-green/50'} ${className}`}>
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-nexus-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-nexus-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-nexus-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-nexus-green opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {title && (
        <div className="absolute -top-3 left-4 bg-nexus-black px-2 text-[10px] uppercase tracking-widest text-nexus-gray group-hover:text-nexus-green transition-colors border border-nexus-border group-hover:border-nexus-green">
          {title}
        </div>
      )}
      <div className="p-6 h-full">
        {children}
      </div>
    </div>
  );
};

export const TerminalButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyles = "relative px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-200 focus:outline-none";
  const variants = {
    primary: "bg-nexus-green/10 text-nexus-green border border-nexus-green hover:bg-nexus-green hover:text-black active:translate-y-[1px]",
    secondary: "bg-transparent text-nexus-gray border border-nexus-border hover:border-nexus-gray hover:text-white"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const TerminalInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input 
      {...props}
      className={`w-full bg-black border-b border-nexus-border py-2 px-3 text-nexus-green font-mono text-sm focus:border-nexus-green focus:outline-none placeholder-nexus-gray/30 transition-colors ${props.className}`}
    />
  );
};

export const GridBackground: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-[-1]">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-nexus-black via-transparent to-transparent"></div>
  </div>
);
