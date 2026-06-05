import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const Welcome = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ padding: '2rem' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
        <div className="flex justify-center mb-6">
          <div style={{ position: 'relative', width: '60px', height: '60px' }}>
            <div style={{
              position: 'absolute', width: '48px', height: '48px',
              borderRadius: '50%', backgroundColor: 'var(--primary-purple)',
              left: '0', top: '6px', mixBlendMode: 'multiply'
            }}></div>
            <div style={{
              position: 'absolute', width: '48px', height: '48px',
              borderRadius: '50%', backgroundColor: 'var(--primary-mint)',
              right: '0', top: '6px', mixBlendMode: 'multiply',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontFamily: 'Inter, sans-serif', fontSize: '24px', fontWeight: 'bold'
            }}>S</div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Bienvenido a Serenify</h2>
        <p className="text-muted mb-8">Para brindarte una experiencia personalizada, ¿cómo te llamas?</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Tu nombre..." 
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'rgba(255, 255, 255, 0.5)',
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-purple)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
          <button type="submit" className="btn btn-primary w-full" disabled={!name.trim()}>
            Comenzar <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
