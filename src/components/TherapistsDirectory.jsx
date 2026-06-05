import React, { useState } from 'react';
import { Star, Calendar, CheckCircle } from 'lucide-react';
import { therapistsData } from '../data/mockData';

const TherapistsDirectory = () => {
  const [scheduledTherapist, setScheduledTherapist] = useState(null);

  const handleSchedule = (name) => {
    setScheduledTherapist(name);
    setTimeout(() => setScheduledTherapist(null), 3000);
  };

  return (
    <div className="therapists-directory">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-white drop-shadow-md">Encuentra a tu profesional ideal</h2>
        <p className="text-white mt-2 font-medium opacity-90">Nuestros especialistas están aquí para acompañarte.</p>
      </header>

      {/* Success Notification Modal / Toast */}
      {scheduledTherapist && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 1000,
          background: 'var(--primary-mint)', color: 'var(--text-main)',
          padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: '1rem',
          animation: 'fadeIn 0.3s ease-in-out'
        }}>
          <CheckCircle size={24} />
          <div>
            <h4 className="font-bold">¡Sesión Agendada!</h4>
            <p className="text-sm">Tu cita con {scheduledTherapist} ha sido confirmada.</p>
          </div>
        </div>
      )}

      <div className="grid-cards">
        {therapistsData.map((therapist) => (
          <div key={therapist.id} className="glass-card flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="avatar" 
                style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: 'var(--primary-purple)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: 'bold'
                }}
              >
                {therapist.name.split(' ').map(n => n[0]).slice(0, 2).join('').replace('.', '')}
              </div>
              <div>
                <h3 className="font-bold text-lg text-main">{therapist.name}</h3>
                <p className="text-sm text-purple font-semibold">{therapist.specialty}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm text-muted">
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span className="font-bold text-main">{therapist.rating}</span>
              <span>({therapist.reviews} reseñas)</span>
            </div>

            <p className="text-muted text-sm flex-1 mb-6 italic">
              "{therapist.description}"
            </p>

            <button 
              className="btn btn-mint w-full mt-auto"
              onClick={() => handleSchedule(therapist.name)}
            >
              <Calendar size={18} />
              Agendar Sesión
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TherapistsDirectory;
