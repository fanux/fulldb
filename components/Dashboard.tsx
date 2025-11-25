import React, { useState, useRef, useEffect } from 'react';
import { Send, Pin, Activity, BarChart3, PieChart, LineChart, MessageSquare, Terminal } from 'lucide-react';
import { TerminalBox, TerminalInput, TerminalButton } from './TerminalUI';
import { TableSchema, ChatMessage, ChartData, DashboardItem } from '../types';
import { generateQueryAndChartConfig } from '../services/geminiService';
import { mockExecuteQuery } from '../services/mockDb';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
  LineChart as ReLineChart, Line, PieChart as RePieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

interface DashboardProps {
  schema: TableSchema;
}

const COLORS = ['#00FF41', '#008F24', '#CCFFDB', '#FFFFFF', '#666666'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-nexus-black border border-nexus-green p-2 shadow-[0_0_10px_rgba(0,255,65,0.2)]">
        <p className="font-mono text-[10px] text-nexus-gray mb-1">{label}</p>
        <p className="font-mono text-xs text-white font-bold">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const RenderChart = ({ data }: { data: ChartData }) => {
  if (!data.data || data.data.length === 0) return <div className="text-xs text-nexus-gray font-mono">NO DATA STREAM</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      {data.type === 'bar' ? (
        <BarChart data={data.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis dataKey={data.xAxisKey} stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{fill: '#333', opacity: 0.2}} />
          <Bar dataKey={data.dataKeys[0]} fill="#00FF41" radius={[0, 0, 0, 0]} />
        </BarChart>
      ) : data.type === 'line' ? (
        <ReLineChart data={data.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis dataKey={data.xAxisKey} stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey={data.dataKeys[0]} stroke="#00FF41" strokeWidth={2} dot={{r: 3, fill: '#050505', stroke: '#00FF41'}} activeDot={{r: 5, fill: '#00FF41'}} />
        </ReLineChart>
      ) : data.type === 'pie' ? (
        <RePieChart>
          <Pie
            data={data.data}
            dataKey={data.dataKeys[0]}
            nameKey={data.xAxisKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            stroke="#050505"
            strokeWidth={2}
          >
            {data.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </RePieChart>
      ) : (
        <AreaChart data={data.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
           <defs>
            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00FF41" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey={data.xAxisKey} stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey={data.dataKeys[0]} stroke="#00FF41" fillOpacity={1} fill="url(#colorVal)" />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ schema }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'init',
    role: 'system',
    content: `SYSTEM ONLINE. CONNECTED TO ${schema.tableName.toUpperCase()}. WAITING FOR QUERY...`,
    timestamp: Date.now()
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<DashboardItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // 1. Get SQL and Chart Config from Gemini
      const { sql, chartConfig, explanation } = await generateQueryAndChartConfig(userMsg.content, schema);
      
      // 2. Mock execute query
      const data = await mockExecuteQuery(chartConfig);
      
      const fullChartData: ChartData = { ...chartConfig, data };

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: explanation,
        timestamp: Date.now(),
        sqlQuery: sql,
        chartData: fullChartData
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: 'ERROR: UNABLE TO PARSE QUERY INTENT. CHECK SYNTAX OR CONNECTION.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePin = (chart: ChartData) => {
    const newItem: DashboardItem = {
      id: Date.now().toString(),
      chart,
      width: 'half'
    };
    setPinnedItems(prev => [newItem, ...prev]);
  };

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden">
      {/* LEFT: Chat & Discovery */}
      <div className="w-full md:w-[450px] flex flex-col border-r border-nexus-border bg-nexus-black/80 z-10">
        <div className="p-4 border-b border-nexus-border flex items-center gap-2">
          <Terminal className="w-4 h-4 text-nexus-green" />
          <span className="font-mono text-xs font-bold text-white tracking-widest">QUERY TERMINAL</span>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] font-mono text-sm p-3 border ${
                msg.role === 'user' 
                  ? 'border-nexus-gray text-white bg-nexus-surface' 
                  : msg.role === 'system' 
                    ? 'border-red-900/50 text-red-500' 
                    : 'border-nexus-green text-nexus-green bg-nexus-green/5'
              }`}>
                {msg.content}
              </div>
              
              {msg.sqlQuery && (
                <div className="mt-2 w-full text-[10px] font-mono text-nexus-gray bg-black p-2 border border-nexus-border">
                  <span className="text-nexus-green">$</span> {msg.sqlQuery}
                </div>
              )}

              {msg.chartData && (
                <div className="mt-4 w-full h-48 border border-nexus-border bg-black/50 p-2 relative group">
                  <button 
                    onClick={() => handlePin(msg.chartData!)}
                    className="absolute top-2 right-2 p-1 border border-nexus-gray hover:border-nexus-green hover:text-nexus-green text-nexus-gray bg-black z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Pin to Dashboard"
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  <RenderChart data={msg.chartData} />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-nexus-green text-xs font-mono animate-pulse">
              <Activity className="w-3 h-3" />
              PROCESSING QUERY...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-nexus-border bg-nexus-black">
          <div className="relative">
            <TerminalInput 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question about your data..."
              className="pr-12"
            />
            <button 
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-nexus-green hover:text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Dashboard Grid */}
      <div className="flex-1 bg-nexus-black overflow-y-auto p-6 custom-scrollbar">
        <div className="mb-6 flex items-center justify-between">
           <h2 className="text-xl font-mono text-white tracking-widest flex items-center gap-3">
             <BarChart3 className="w-5 h-5 text-nexus-green" />
             LIVE DASHBOARD
           </h2>
           <span className="text-[10px] uppercase text-nexus-gray border border-nexus-border px-2 py-1">
             read_mode: active
           </span>
        </div>

        {pinnedItems.length === 0 ? (
          <div className="h-[60vh] flex flex-col items-center justify-center border border-dashed border-nexus-border text-nexus-gray opacity-50">
            <Activity className="w-12 h-12 mb-4" />
            <p className="font-mono text-sm tracking-wider">NO METRICS PINNED</p>
            <p className="text-[10px] mt-2">Use the query terminal to generate and pin insights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {pinnedItems.map((item) => (
              <TerminalBox key={item.id} title={item.chart.title.toUpperCase()} active={false} className="h-64">
                <RenderChart data={item.chart} />
              </TerminalBox>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
