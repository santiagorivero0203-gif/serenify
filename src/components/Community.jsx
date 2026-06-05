import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

const Community = () => {
  const posts = [
    {
      id: 1,
      user: "María G.",
      content: "Hoy probé la técnica de respiración guiada de 5 minutos antes de mi reunión y la diferencia fue abismal. ¡Totalmente recomendada!",
      likes: 14,
      comments: 3
    },
    {
      id: 2,
      user: "Carlos M.",
      content: "Alguien tiene tips para lidiar con el insomnio provocado por el estrés laboral? Estoy buscando nuevas estrategias.",
      likes: 8,
      comments: 12
    },
    {
      id: 3,
      user: "Dra. Elena Rostova",
      content: "Recuerden que tomar pequeñas pausas de 2 minutos cada hora para estirarse no es un lujo, es una necesidad para la mente.",
      likes: 45,
      comments: 5
    }
  ];

  return (
    <div className="community-section">
      <header className="mb-8">
        <h2 className="text-3xl font-bold">Comunidad de Apoyo</h2>
        <p className="text-muted mt-2">Comparte tus experiencias y conecta con personas en tu mismo viaje.</p>
      </header>

      <div className="flex flex-col gap-4">
        {posts.map(post => (
          <div key={post.id} className="glass-card">
            <h4 className="font-bold text-lg text-purple mb-2">{post.user}</h4>
            <p className="text-main mb-4">{post.content}</p>
            
            <div className="flex items-center gap-6 text-muted text-sm font-semibold">
              <button className="flex items-center gap-2 hover:text-purple transition" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Heart size={18} /> {post.likes}
              </button>
              <button className="flex items-center gap-2 hover:text-purple transition" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <MessageCircle size={18} /> {post.comments} respuestas
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="btn btn-mint w-full mt-6 text-lg py-3">
        Compartir un mensaje
      </button>
    </div>
  );
};

export default Community;
