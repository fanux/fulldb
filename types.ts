export enum AppView {
  CONNECT = 'CONNECT',
  SCHEMA = 'SCHEMA',
  DASHBOARD = 'DASHBOARD'
}

export interface DataSource {
  type: 'POSTGRES' | 'CSV';
  connectionString?: string;
  fileName?: string;
  fileContent?: string;
}

export interface ColumnDefinition {
  name: string;
  type: string;
  description: string;
  isConfirmed: boolean;
}

export interface TableSchema {
  tableName: string;
  columns: ColumnDefinition[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  chartData?: ChartData;
  sqlQuery?: string;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: any[];
  xAxisKey: string;
  dataKeys: string[];
}

export interface DashboardItem {
  id: string;
  chart: ChartData;
  width: 'full' | 'half';
}
