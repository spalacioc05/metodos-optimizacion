import React, { useState } from 'react';
import SideMenu from './SideMenu';
import MethodPanel from './MethodPanel';
import '../styles/global.css';
import '../styles/app.css';

export function App() {
  const [selectedMethod, setSelectedMethod] = useState('bisection');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setSidebarOpen(false);
  };

  return (
    <div className="app-container">
      <SideMenu
        isOpen={sidebarOpen}
        onMethodSelect={handleMethodSelect}
        activeMethod={selectedMethod}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <main className={`app-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="container-content">
          <MethodPanel methodId={selectedMethod} onMenuOpen={() => setSidebarOpen(true)} />
        </div>
      </main>
    </div>
  );
}

export default App;
