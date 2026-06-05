import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Logo from './Logo';

/**
 * Pantalla inicial de bienvenida y registro de nombre del usuario.
 */
const Welcome = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onComplete(name.trim());
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-card">
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <Logo size={64} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Serenify
        </h1>
        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.95rem' }}>
          Tu espacio personal para el bienestar mental. ¿Cómo te llamas?
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            className="form-input"
            type="text"
            placeholder="Escribe tu nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={40}
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={!name.trim()}
            style={{ justifyContent: 'center', padding: '0.9rem' }}
          >
            Comenzar <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Tu información no se comparte con nadie 🔒
        </p>
      </div>
    </div>
  );
};

export default Welcome;
