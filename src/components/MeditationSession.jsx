import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const MeditationSession = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="meditation-session h-full flex flex-col items-center justify-center">
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '3rem 2rem' }}>
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-purple tracking-widest uppercase mb-2">Respiración Guiada</p>
          <h2 className="text-3xl font-bold">Encontrando tu Centro</h2>
          <p className="text-muted mt-2">Dra. Elena Rostova</p>
        </div>

        {/* Visualizer / Avatar */}
        <div className="flex justify-center mb-10">
          <div style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-mint) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isPlaying ? '0 0 40px rgba(163, 228, 215, 0.6)' : '0 10px 30px rgba(107, 76, 154, 0.2)',
            transition: 'all 0.5s ease',
            animation: isPlaying ? 'pulse 4s infinite ease-in-out' : 'none'
          }}>
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(5px)'
            }}></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted mb-2 font-medium">
            <span>02:15</span>
            <span>10:00</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'rgba(107, 76, 154, 0.1)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '22.5%',
              height: '100%',
              backgroundColor: 'var(--primary-mint)',
              borderRadius: '3px',
              transition: 'width 1s linear'
            }}></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button className="btn-icon text-muted hover:text-purple transition-colors">
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-purple)',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(107, 76, 154, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: '4px' }} />}
          </button>

          <button className="btn-icon text-muted hover:text-purple transition-colors">
            <SkipForward size={24} />
          </button>
        </div>

        <div className="flex justify-center mt-8 text-muted">
           <Volume2 size={20} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}} />
    </div>
  );
};

export default MeditationSession;
