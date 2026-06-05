import React from 'react';
import { Activity, Clock, Zap, Play } from 'lucide-react';

const Dashboard = ({ setActiveTab, userName }) => {
  return (
    <div className="dashboard">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-main">
          Hola, {userName}. ¿Cómo está tu energía hoy?
        </h2>
        <p className="text-muted mt-2 font-medium">Aquí tienes un resumen de tu progreso.</p>
      </header>

      <div className="grid-cards mb-10">
        {/* Nivel de Estrés */}
        <div className="glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted">Nivel de estrés actual</h3>
            <Activity className="text-mint" size={24} />
          </div>
          <div className="flex items-center gap-4">
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="rgba(80, 211, 163, 0.2)" strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="var(--primary-mint)" strokeWidth="3" strokeDasharray="30, 100"
                />
              </svg>
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)'
              }}>
                30%
              </div>
            </div>
            <div>
              <p className="font-bold text-xl text-main">Bajo</p>
              <p className="text-sm text-muted">Buen trabajo gestionando tu día.</p>
            </div>
          </div>
        </div>

        {/* Minutos de Meditación */}
        <div className="glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted">Meditación esta semana</h3>
            <Clock className="text-purple" size={24} />
          </div>
          <div className="flex items-end gap-2 mt-4">
            <span className="text-4xl font-bold text-main">145</span>
            <span className="text-muted mb-1 font-medium">minutos</span>
          </div>
        </div>

        {/* Racha de Días */}
        <div className="glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted">Racha activa</h3>
            <Zap className="text-mint" size={24} />
          </div>
          <div className="flex items-end gap-2 mt-4">
            <span className="text-4xl font-bold text-main">5</span>
            <span className="text-muted mb-1 font-medium">días consecutivos</span>
          </div>
        </div>
      </div>

      <section>
        <h3 className="text-2xl font-bold mb-4 text-main">Actividad Recomendada</h3>
        <div className="glass-card flex items-center justify-between" style={{
          borderLeft: '6px solid var(--primary-mint)'
        }}>
          <div>
            <h4 className="font-bold text-xl text-main">Respiración profunda (5 min)</h4>
            <p className="text-muted mt-2">Ideal para reducir el estrés antes de tu próxima reunión.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setActiveTab('meditation')}>
            <Play size={18} fill="white" />
            Iniciar Sesión
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
