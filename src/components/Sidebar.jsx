import React from 'react';
import { Home, Users, Headphones, MessageSquare, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: <Home size={20} /> },
    { id: 'therapists', label: 'Profesionales', icon: <Users size={20} /> },
    { id: 'meditation', label: 'Meditación', icon: <Headphones size={20} /> },
    { id: 'community', label: 'Comunidad', icon: <MessageSquare size={20} /> },
  ];

  const Logo = () => (
    <div style={{
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      backgroundColor: '#9867F0', // Light purple outer circle
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(152, 103, 240, 0.3)'
    }}>
      <div style={{
        position: 'absolute',
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        backgroundColor: '#4A2B78', // Dark purple inner
        left: '4px'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        backgroundColor: '#44D0A4', // Mint green inner
        right: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mixBlendMode: 'normal',
        opacity: 0.95
      }}>
        <span style={{
          color: 'white',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          fontSize: '16px',
          marginLeft: '1px'
        }}>S</span>
      </div>
    </div>
  );

  return (
    <aside className="glass-card" style={{ 
      width: '260px', 
      height: 'calc(100vh - 4rem)', 
      margin: '2rem 0 2rem 2rem',
      position: 'sticky',
      top: '2rem',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1.5rem'
    }}>
      <div className="mb-10" style={{ padding: '0 0.5rem' }}>
        <h1 className="text-3xl font-bold text-main" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Logo />
          Serenify
        </h1>
      </div>

      <nav className="flex flex-col gap-3" style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.25rem', borderRadius: '16px', border: 'none',
              background: activeTab === item.id ? 'var(--primary-mint)' : 'transparent',
              color: activeTab === item.id ? 'white' : 'var(--text-muted)',
              fontWeight: activeTab === item.id ? '600' : '500',
              cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
              fontFamily: 'Inter, sans-serif', fontSize: '1rem'
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <button style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '1rem 1.25rem', borderRadius: '16px', border: 'none',
        background: 'transparent', color: 'var(--text-muted)',
        fontWeight: '500', cursor: 'pointer', marginTop: 'auto',
        fontFamily: 'Inter, sans-serif', fontSize: '1rem'
      }}>
        <LogOut size={20} />
        Cerrar Sesión
      </button>
    </aside>
  );
};

export default Sidebar;
