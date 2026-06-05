import React from 'react';
import { Home, Users, Headphones, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: <Home size={20} /> },
    { id: 'therapists', label: 'Profesionales', icon: <Users size={20} /> },
    { id: 'meditation', label: 'Meditación', icon: <Headphones size={20} /> },
  ];

  return (
    <aside className="glass-card" style={{ 
      width: '260px', 
      height: 'calc(100vh - 4rem)', 
      margin: '2rem 0 2rem 2rem',
      position: 'sticky',
      top: '2rem',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.95)' // Make sidebar more opaque for contrast
    }}>
      <div className="mb-10" style={{ padding: '0 0.5rem' }}>
        <h1 className="text-3xl font-bold text-main" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Logo Serenify: Overlapping circles */}
          <div style={{ position: 'relative', width: '40px', height: '40px' }}>
            <div style={{
              position: 'absolute',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#4B3386', // Dark Purple
              left: '0',
              top: '4px',
              mixBlendMode: 'multiply'
            }}></div>
            <div style={{
              position: 'absolute',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-mint)',
              right: '0',
              top: '4px',
              mixBlendMode: 'multiply',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontFamily: 'Fredoka, sans-serif',
              fontSize: '18px',
              fontWeight: '600'
            }}>S</div>
          </div>
          Serenify
        </h1>
      </div>

      <nav className="flex flex-col gap-3" style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              border: 'none',
              background: activeTab === item.id ? 'var(--primary-mint)' : 'transparent',
              color: activeTab === item.id ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: activeTab === item.id ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1rem'
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <button style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderRadius: '16px',
        border: 'none',
        background: 'transparent',
        color: 'var(--text-muted)',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: 'auto',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1rem'
      }}>
        <LogOut size={20} />
        Cerrar Sesión
      </button>
    </aside>
  );
};

export default Sidebar;
