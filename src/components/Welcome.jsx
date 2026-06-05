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

  const Logo = () => (
    <div style={{
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: '#9867F0', // Light purple outer circle
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 15px rgba(152, 103, 240, 0.4)'
    }}>
      <div style={{
        position: 'absolute',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        backgroundColor: '#4A2B78', // Dark purple inner
        left: '6px'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        backgroundColor: '#44D0A4', // Mint green inner
        right: '6px',
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
          fontSize: '24px',
          marginLeft: '1px'
        }}>S</span>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ padding: '2rem' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '3rem 2rem', textAlign: 'center' }}>
        <div className="flex justify-center mb-6">
          <Logo />
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
