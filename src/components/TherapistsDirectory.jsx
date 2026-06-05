import React from 'react';
import { Star, Calendar } from 'lucide-react';
import { therapistsData } from '../data/mockData';

const TherapistsDirectory = () => {
  return (
    <div className="therapists-directory">
      <header className="mb-8">
        <h2 className="text-2xl font-bold">Encuentra a tu profesional ideal</h2>
        <p className="text-muted mt-2">Nuestros especialistas están aquí para acompañarte.</p>
      </header>

      <div className="grid-cards">
        {therapistsData.map((therapist) => (
          <div key={therapist.id} className="glass-card flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="avatar" 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'var(--primary-purple)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}
              >
                {therapist.name.split(' ').map(n => n[0]).slice(0, 2).join('').replace('.', '')}
              </div>
              <div>
                <h3 className="font-bold">{therapist.name}</h3>
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

            <button className="btn btn-mint w-full mt-auto">
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
