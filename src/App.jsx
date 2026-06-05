import React, { useState } from 'react';
import Sidebar, { BottomNav } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TherapistsDirectory from './components/TherapistsDirectory';
import MeditationSession from './components/MeditationSession';
import Community from './components/Community';
import Welcome from './components/Welcome';
import './index.css';

function App() {
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!userName) {
    return <Welcome onComplete={setUserName} />;
  }

  const handleLogout = () => {
    setUserName('');
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} userName={userName} />;
      case 'therapists':
        return <TherapistsDirectory />;
      case 'meditation':
        return <MeditationSession />;
      case 'community':
        return <Community userName={userName} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} userName={userName} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar for Desktop */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      {/* Main Content Area */}
      <main className="main-content">
        <div style={{ animation: 'fadeIn 0.3s ease-out', maxWidth: '100%' }}>
          {renderContent()}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
