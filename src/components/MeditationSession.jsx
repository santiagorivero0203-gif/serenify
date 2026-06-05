import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const SESSIONS = [
  { title: 'Respiración Profunda', subtitle: 'Dra. Elena Rostova', duration: 300 },
  { title: 'Meditación Matutina',  subtitle: 'Lic. Mateo Vargas',  duration: 480 },
  { title: 'Relajación Nocturna',  subtitle: 'Dra. Sarah Jenkins', duration: 600 },
];

/**
 * Reproductor de sesiones de meditación con temporizador real,
 * animación de respiración guiada y audio binaural simulado.
 */
const MeditationSession = () => {
  const [sessionIdx, setSessionIdx]   = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [elapsed, setElapsed]         = useState(0);
  const [muted, setMuted]             = useState(false);

  const session = SESSIONS[sessionIdx];

  // Reinicia el tiempo cuando cambia la sesión
  useEffect(() => {
    setIsPlaying(false);
    setElapsed(0);
  }, [sessionIdx]);

  // Temporizador real (tick cada segundo)
  useEffect(() => {
    if (!isPlaying) return;
    if (elapsed >= session.duration) { setIsPlaying(false); return; }
    const id = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(id);
  }, [isPlaying, elapsed, session.duration]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const pct  = (elapsed / session.duration) * 100;

  const prevSession = () => setSessionIdx(i => Math.max(0, i - 1));
  const nextSession = () => setSessionIdx(i => Math.min(SESSIONS.length - 1, i + 1));

  // Instrucción de respiración animada
  const breathPhase = isPlaying
    ? (elapsed % 8 < 4 ? 'Inhala...' : 'Exhala...')
    : 'Presiona play';

  return (
    <div className="meditation-page">
      <div className="meditation-card">
        {/* Cabecera sesión */}
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-purple tracking-widest uppercase mb-1">Sesión Guiada</p>
          <h2 className="text-2xl font-bold text-main">{session.title}</h2>
          <p className="text-sm text-muted mt-1">{session.subtitle}</p>
        </div>

        {/* Orbe de respiración */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          <div className={`meditation-orb${isPlaying ? ' playing' : ''}`}>
            <div className="meditation-orb-inner" />
          </div>
          <p style={{
            fontSize: '0.9rem', fontWeight: 600,
            color: isPlaying ? 'var(--primary-mint-hover)' : 'var(--text-muted)',
            letterSpacing: '0.05em', transition: 'color 0.5s'
          }}>
            {breathPhase}
          </p>
        </div>

        {/* Barra de progreso */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div className="flex justify-between text-sm text-muted mb-2 font-medium">
            <span>{fmt(elapsed)}</span>
            <span>{fmt(session.duration)}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Controles */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <button
            className="btn-icon"
            onClick={prevSession}
            disabled={sessionIdx === 0}
            aria-label="Sesión anterior"
            style={{ opacity: sessionIdx === 0 ? 0.35 : 1 }}
          >
            <SkipBack size={22} />
          </button>

          <button
            className="play-btn"
            onClick={() => setIsPlaying(p => !p)}
            aria-label={isPlaying ? 'Pausar sesión' : 'Iniciar sesión'}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 3 }} />}
          </button>

          <button
            className="btn-icon"
            onClick={nextSession}
            disabled={sessionIdx === SESSIONS.length - 1}
            aria-label="Siguiente sesión"
            style={{ opacity: sessionIdx === SESSIONS.length - 1 ? 0.35 : 1 }}
          >
            <SkipForward size={22} />
          </button>
        </div>

        {/* Volumen / Silencio */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setMuted(m => !m)}
            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {muted ? 'Sonido desactivado' : 'Sonido binaural'}
          </button>
        </div>

        {/* Lista de sesiones */}
        <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {SESSIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setSessionIdx(i)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 1rem', borderRadius: 12, border: 'none',
                background: i === sessionIdx ? 'rgba(80,211,163,0.1)' : 'transparent',
                color: i === sessionIdx ? 'var(--primary-mint-hover)' : 'var(--text-muted)',
                fontWeight: i === sessionIdx ? 600 : 500,
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%'
              }}
            >
              <span style={{ fontSize: '0.875rem' }}>{s.title}</span>
              <span style={{ fontSize: '0.8rem' }}>{fmt(s.duration)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeditationSession;
