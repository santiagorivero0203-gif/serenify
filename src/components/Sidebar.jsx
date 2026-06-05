import React from 'react';
import { Home, Users, Headphones, MessageSquare, LogOut } from 'lucide-react';
import Logo from './Logo';

const MENU = [
  { id: 'dashboard',  label: 'Inicio',        icon: Home },
  { id: 'therapists', label: 'Especialistas',  icon: Users },
  { id: 'meditation', label: 'Meditación',     icon: Headphones },
  { id: 'community',  label: 'Comunidad',      icon: MessageSquare },
];

/**
 * Barra lateral de navegación — solo visible en desktop/tablet.
 * En móvil se usa BottomNav.
 */
const Sidebar = ({ activeTab, setActiveTab, onLogout }) => (
  <aside className="sidebar">
    {/* Marca */}
    <div className="sidebar-logo">
      <Logo size={40} />
      <h1>Serenify</h1>
    </div>

    {/* Navegación */}
    <nav className="sidebar-nav">
      {MENU.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`sidebar-btn ${activeTab === id ? 'active' : ''}`}
          onClick={() => setActiveTab(id)}
          aria-current={activeTab === id ? 'page' : undefined}
        >
          <Icon size={20} aria-hidden="true" />
          <span className="btn-label">{label}</span>
        </button>
      ))}
    </nav>

    {/* Cerrar sesión */}
    <button className="sidebar-logout" onClick={onLogout} aria-label="Cerrar sesión">
      <LogOut size={18} aria-hidden="true" />
      <span>Cerrar Sesión</span>
    </button>
  </aside>
);

/**
 * Barra de navegación inferior — solo visible en móvil.
 */
export const BottomNav = ({ activeTab, setActiveTab }) => (
  <nav className="bottom-nav" aria-label="Navegación principal">
    <div className="bottom-nav-inner">
      {MENU.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`bottom-nav-btn ${activeTab === id ? 'active' : ''}`}
          onClick={() => setActiveTab(id)}
          aria-current={activeTab === id ? 'page' : undefined}
        >
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  </nav>
);

export default Sidebar;
