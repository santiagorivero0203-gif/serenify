import React, { useState } from 'react';
import { Star, Calendar, X } from 'lucide-react';
import { therapistsData } from '../data/mockData';
import Toast from './Toast';

/**
 * Directorio de terapeutas con modal de agendamiento de cita con fecha y hora.
 */
const TherapistsDirectory = () => {
  const [modal, setModal] = useState(null);   // { id, name } del terapeuta seleccionado
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [toast, setToast] = useState(null);

  // Fecha mínima = hoy
  const today = new Date().toISOString().split('T')[0];

  const handleOpenModal = (therapist) => {
    setModal(therapist);
    setDate('');
    setTime('');
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    setToast({
      title: '¡Sesión Agendada! 🎉',
      message: `Cita con ${modal.name} el ${formattedDate} a las ${time}.`
    });
    setModal(null);
  };

  return (
    <div className="therapists-directory">
      {/* Toast */}
      {toast && <Toast title={toast.title} message={toast.message} onClose={() => setToast(null)} />}

      {/* Modal de agendamiento */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Agendar con {modal.name}</h3>
              <button className="modal-close" onClick={() => setModal(null)} aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label">📅 Fecha de la cita</label>
                <input
                  className="form-input"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">🕐 Hora de la cita</label>
                <select
                  className="form-input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Selecciona un horario...</option>
                  {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                    <option key={t} value={t}>{t} hs</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline flex-1" onClick={() => setModal(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-mint flex-1" disabled={!date || !time}>
                  <Calendar size={16} />
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cabecera */}
      <header className="page-header">
        <h2>Nuestros Especialistas</h2>
        <p>Encuentra al profesional ideal para acompañarte.</p>
      </header>

      {/* Tarjetas */}
      <div className="grid-cards">
        {therapistsData.map((t) => (
          <div key={t.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Info del terapeuta */}
            <div className="flex items-center gap-3">
              <div className="therapist-avatar">
                {t.name.split(' ').filter(n => n !== 'Dra.' && n !== 'Lic.').slice(0, 2).map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-main">{t.name}</h3>
                <p className="text-sm text-purple font-semibold">{t.specialty}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <Star size={14} fill="#F59E0B" color="#F59E0B" />
              <span className="font-bold text-sm text-main">{t.rating}</span>
              <span className="text-sm text-muted">({t.reviews} reseñas)</span>
            </div>

            {/* Descripción */}
            <p className="text-sm text-muted italic" style={{ flexGrow: 1 }}>
              "{t.description}"
            </p>

            {/* Botón */}
            <button
              className="btn btn-mint w-full"
              onClick={() => handleOpenModal(t)}
            >
              <Calendar size={16} />
              Agendar Sesión
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TherapistsDirectory;
