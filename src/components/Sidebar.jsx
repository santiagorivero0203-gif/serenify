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
      width: '250px', 
      height: 'calc(100vh - 4rem)', 
      margin: '2rem 0 2rem 2rem',
      position: 'sticky',
      top: '2rem',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem'
    }}>
      <div className="mb-8" style={{ padding: '0 1rem' }}>
        <h1 className="text-2xl font-bold text-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-mint)' }}></div>
          Serenify
        </h1>
      </div>

      <nav className="flex flex-col gap-2" style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === item.id ? 'var(--primary-mint)' : 'transparent',
              color: activeTab === item.id ? 'var(--text-main)' : 'var(--text-muted)',
              fontWeight: activeTab === item.id ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left'
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
        padding: '1rem',
        borderRadius: '12px',
        border: 'none',
        background: 'transparent',
        color: 'var(--text-muted)',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: 'auto'
      }}>
        <LogOut size={20} />
        Cerrar Sesión
      </button>
    </aside>
  );
};

export default Sidebar;
