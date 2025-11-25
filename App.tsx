import React, { useState } from 'react';
import { Layout } from './Layout';
import { ConnectView } from './components/ConnectView';
import { SchemaChecklist } from './components/SchemaChecklist';
import { Dashboard } from './components/Dashboard';
import { AppView, DataSource, TableSchema } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CONNECT);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const [schema, setSchema] = useState<TableSchema | null>(null);

  const handleConnect = (source: DataSource) => {
    setDataSource(source);
    setCurrentView(AppView.SCHEMA);
  };

  const handleSchemaConfirmed = (confirmedSchema: TableSchema) => {
    setSchema(confirmedSchema);
    setCurrentView(AppView.DASHBOARD);
  };

  return (
    <Layout>
      {currentView === AppView.CONNECT && (
        <ConnectView onConnect={handleConnect} />
      )}
      
      {currentView === AppView.SCHEMA && (
        <div className="h-full py-12">
          <SchemaChecklist onConfirm={handleSchemaConfirmed} />
        </div>
      )}

      {currentView === AppView.DASHBOARD && schema && (
        <Dashboard schema={schema} />
      )}
    </Layout>
  );
};

export default App;
