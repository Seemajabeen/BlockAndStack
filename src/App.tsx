import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { WalletContextProvider } from './contexts/WalletContext';
import WalletConnection from './components/WalletConnection';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import Navigation from './components/Navigation';

const AppContent: React.FC = () => {
  const { isConnected } = useApp();
  const [currentView, setCurrentView] = useState('wallet');

  useEffect(() => {
    if (isConnected) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('wallet');
    }
  }, [isConnected]);

  if (!isConnected) {
    return <WalletConnection />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'marketplace':
        return <Marketplace />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {renderCurrentView()}
      <div className="pb-20">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
      </div>
    </div>
  );
};

function App() {
  return (
    <WalletContextProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </WalletContextProvider>
  );
}

export default App;