import React, { useState } from 'react';
import { Activity, Clock, Zap, Play, Plus } from 'lucide-react';
import Toast from './Toast';

/**
 * Dashboard principal del usuario.
 * Muestra estadísticas, nivel de estrés y actividad recomendada.
 */
const Dashboard = ({ setActiveTab, userName }) => {
  const [toast, setToast] = useState(null);

  const handleRegisterState = () => {
    setToast({ title: '¡Estado registrado!', message: 'Gracias por tomarte un momento para ti.' });
  };

  return (
    <div className="dashboard">
      {/* Toast de confirmación */}
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Cabecera */}
      <header className="dashboard-header page-header">
        <div>
          <h2 className="text-3xl font-bold text-main">
            Hola, {userName} 👋
          </h2>
          <p className="text-muted mt-1">Aquí tienes un resumen de tu progreso de hoy.</p>
        </div>
        <button className="btn btn-mint" onClick={handleRegisterState}>
          <Plus size={18} />
          Registrar Estado
        </button>
      </header>

      {/* Tarjetas de estadísticas */}
      <div className="grid-cards mb-8">
        {/* Nivel de estrés */}
        <div className="stat-card flex flex-col" style={{ gap: '1rem' }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted uppercase tracking-wide">Nivel de estrés</span>
            <Activity size={20} style={{ color: 'var(--primary-mint)' }} />
          </div>
          <div className="flex items-center gap-4">
            {/* Gráfico circular */}
            <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(80,211,163,0.15)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none" stroke="var(--primary-mint)" strokeWidth="3"
                  strokeDasharray="30 70" strokeLinecap="round"
                  style={{ animation: 'fillProgress 1.2s ease-out forwards' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)'
              }}>30%</div>
            </div>
            <div>
              <p className="font-bold text-xl text-main">Bajo</p>
              <p className="text-sm text-muted">Buen trabajo hoy 🌿</p>
            </div>
          </div>
        </div>

        {/* Minutos meditados */}
        <div className="stat-card flex flex-col" style={{ gap: '1rem' }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted uppercase tracking-wide">Meditación</span>
            <Clock size={20} style={{ color: 'var(--primary-purple)' }} />
          </div>
          <div className="flex items-end gap-2" style={{ marginTop: 'auto' }}>
            <span className="text-4xl font-bold text-main">145</span>
            <span className="text-muted font-medium" style={{ paddingBottom: '4px' }}>min esta semana</span>
          </div>
        </div>

        {/* Racha */}
        <div className="stat-card flex flex-col" style={{ gap: '1rem' }}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted uppercase tracking-wide">Racha activa</span>
            <Zap size={20} style={{ color: 'var(--primary-mint)' }} />
          </div>
          <div className="flex items-end gap-2" style={{ marginTop: 'auto' }}>
            <span className="text-4xl font-bold text-main">5</span>
            <span className="text-muted font-medium" style={{ paddingBottom: '4px' }}>días seguidos 🔥</span>
          </div>
        </div>
      </div>

      {/* Actividad recomendada */}
      <section>
        <h3 className="text-xl font-bold text-main mb-4">Actividad Recomendada</h3>
        <div className="recommended-card">
          <div style={{ flex: 1 }}>
            <span style={{
              display: 'inline-block', background: 'rgba(80,211,163,0.12)', color: 'var(--primary-mint-hover)',
              borderRadius: 99, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem'
            }}>
              ✨ Recomendado para ti
            </span>
            <h4 className="font-bold text-lg text-main">Respiración profunda — 5 min</h4>
            <p className="text-muted text-sm mt-1">
              Ideal para reducir el estrés antes de tu próxima reunión.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setActiveTab('meditation')}>
            <Play size={16} fill="white" />
            Iniciar
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
