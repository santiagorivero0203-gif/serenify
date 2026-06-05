import React from 'react';

/**
 * Logo de Serenify — círculos superpuestos púrpura y menta con la "S".
 * @param {number} size - Diámetro total del logo en px (default: 44)
 */
const Logo = ({ size = 44 }) => {
  const inner = Math.round(size * 0.59);
  const offset = Math.round(size * 0.09);
  const fontSize = Math.round(size * 0.36);

  return (
    <div
      aria-label="Logo Serenify"
      style={{
        width: size, height: size, borderRadius: '50%',
        backgroundColor: '#9867F0', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(152,103,240,0.35)',
        flexShrink: 0
      }}
    >
      {/* Círculo oscuro izquierdo */}
      <div style={{
        position: 'absolute', width: inner, height: inner,
        borderRadius: '50%', backgroundColor: '#4A2B78', left: offset
      }} />
      {/* Círculo menta derecho con "S" */}
      <div style={{
        position: 'absolute', width: inner, height: inner,
        borderRadius: '50%', backgroundColor: '#44D0A4', right: offset,
        display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.95
      }}>
        <span style={{ color: 'white', fontWeight: 700, fontSize, marginLeft: 1 }}>S</span>
      </div>
    </div>
  );
};

export default Logo;
