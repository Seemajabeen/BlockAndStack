import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import Navigation from './components/Navigation';

const AppContent: React.FC = () => {
  const { isConnected } = useApp();
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    if (isConnected) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  }, [isConnected]);

  if (!isConnected) {
    if (currentView === 'register') {
      return <Registration onComplete={() => setCurrentView('dashboard')} />;
    }
    return (
      <Login 
        onLogin={() => setCurrentView('dashboard')}
        onSignup={() => setCurrentView('register')}
      />
    );
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;