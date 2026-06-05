import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} userName={userName} />;
      case 'therapists':
        return <TherapistsDirectory />;
      case 'meditation':
        return <MeditationSession />;
      case 'community':
        return <Community />;
      default:
        return <Dashboard setActiveTab={setActiveTab} userName={userName} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <div style={{
          animation: 'fadeIn 0.3s ease-in-out',
          height: '100%'
        }}>
          {renderContent()}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}

export default App;
