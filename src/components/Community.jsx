import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react';

const API_URL = 'https://api.restful-api.dev/objects/ff8081819d82fab6019e966a64cb40b9';

const SEED_POSTS = [
  {
    id: 'seed-1',
    user: 'Dra. Elena Rostova',
    content: 'Recuerden que tomar pequeñas pausas de 2 minutos cada hora no es un lujo, es una necesidad para la mente. 🌿',
    likes: 45,
    likedByUser: false,
    comments: [],
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'seed-2',
    user: 'María G.',
    content: 'Hoy probé la respiración guiada de 5 minutos antes de mi reunión y la diferencia fue enorme. ¡Totalmente recomendada! 💚',
    likes: 14,
    likedByUser: false,
    comments: [],
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'seed-3',
    user: 'Carlos M.',
    content: '¿Alguien tiene tips para el insomnio por estrés laboral? Estoy buscando nuevas estrategias 😓',
    likes: 8,
    likedByUser: false,
    comments: [{ id: 'c1', user: 'Lic. Mateo Vargas', text: 'Te recomiendo la sesión de relajación nocturna en la app 🌙' }],
    createdAt: Date.now() - 1800000,
  },
];

const timeAgo = (ts) => {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} días`;
};

/**
 * Sección de comunidad con sincronización EN TIEMPO REAL.
 * Utiliza una API global gratuita para compartir los datos entre todos los dispositivos.
 */
const Community = ({ userName }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newPost, setNewPost] = useState('');
  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Sincronización en tiempo real (Polling)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(API_URL);
        const json = await res.json();
        
        // Si la base de datos está vacía, la llenamos con las semillas
        if (!json.data?.posts || json.data.posts.length === 0) {
          syncWithServer(SEED_POSTS);
          setPosts(SEED_POSTS);
        } else {
          setPosts(json.data.posts);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error conectando al servidor:", err);
        setIsLoading(false);
      }
    };

    fetchPosts();
    // Polling cada 3 segundos para dar efecto de "Tiempo real" en Vercel
    const interval = setInterval(fetchPosts, 3000);
    return () => clearInterval(interval);
  }, []);

  const syncWithServer = async (newPostsData) => {
    try {
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'serenify_posts_v1', data: { posts: newPostsData } })
      });
    } catch (err) {
      console.error('Error sincronizando:', err);
    }
  };

  /* ---- Acciones ---- */
  const addPost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    const post = {
      id: `post-${Date.now()}`,
      user: userName || 'Tú',
      content: newPost.trim(),
      likes: 0,
      likedByUser: false,
      comments: [],
      createdAt: Date.now(),
    };
    const updated = [post, ...posts];
    setPosts(updated); // Actualización optimista
    syncWithServer(updated);
    setNewPost('');
  };

  const toggleLike = (id) => {
    const updated = posts.map(post =>
      post.id !== id ? post : {
        ...post,
        likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
        likedByUser: !post.likedByUser,
      }
    );
    setPosts(updated);
    syncWithServer(updated);
  };

  const addComment = (e, postId) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const comment = { id: `c-${Date.now()}`, user: userName || 'Tú', text: commentText.trim() };
    const updated = posts.map(post =>
      post.id !== postId ? post : { ...post, comments: [...post.comments, comment] }
    );
    setPosts(updated);
    syncWithServer(updated);
    setCommentText('');
    setActiveComment(null);
  };

  const deletePost = (id) => {
    const updated = posts.filter(post => post.id !== id);
    setPosts(updated);
    syncWithServer(updated);
  };

  return (
    <div>
      <header className="page-header flex justify-between items-start">
        <div>
          <h2>Comunidad Global</h2>
          <p>Conectado en tiempo real con todos los dispositivos 🌍</p>
        </div>
        {isLoading && <span style={{ fontSize: '0.8rem', color: 'var(--primary-mint)' }}>Conectando...</span>}
      </header>

      {/* Formulario de publicación */}
      <div className="glass-card mb-6">
        <form onSubmit={addPost} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">¿Qué tienes en mente hoy?</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Comparte algo con la comunidad..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              style={{ resize: 'none' }}
              maxLength={280}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={!newPost.trim() || isLoading}>
            <Send size={16} />
            Publicar
          </button>
        </form>
      </div>

      {/* Lista de posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.length === 0 && !isLoading && (
          <p className="text-muted text-center" style={{ padding: '2rem 0' }}>
            Sé el primero en compartir algo 💬
          </p>
        )}

        {posts.map((post) => (
          <div key={post.id} className="post-card">
            {/* Autor y tiempo */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-purple), var(--primary-mint))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0
                }}>
                  {post.user.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-main">{post.user}</p>
                  <p className="text-xs text-muted">{timeAgo(post.createdAt)}</p>
                </div>
              </div>

              {/* Borrar solo los propios posts */}
              {post.user === (userName || 'Tú') && !post.id.startsWith('seed') && (
                <button
                  onClick={() => deletePost(post.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: 6 }}
                  aria-label="Eliminar publicación"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>

            {/* Contenido */}
            <p className="text-main" style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.875rem' }}>
              {post.content}
            </p>

            {/* Acciones */}
            <div className="post-actions flex items-center gap-2">
              <button
                className={post.likedByUser ? 'liked' : ''}
                onClick={() => toggleLike(post.id)}
                aria-label={post.likedByUser ? 'Quitar like' : 'Dar like'}
              >
                <Heart size={16} fill={post.likedByUser ? 'currentColor' : 'none'} />
                {post.likes}
              </button>
              <button
                onClick={() => setActiveComment(activeComment === post.id ? null : post.id)}
                aria-label="Responder"
              >
                <MessageCircle size={16} />
                {post.comments.length} {post.comments.length === 1 ? 'respuesta' : 'respuestas'}
              </button>
            </div>

            {/* Comentarios existentes */}
            {post.comments && post.comments.length > 0 && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {post.comments.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(123,67,161,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-purple)'
                    }}>
                      {c.user.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ background: 'var(--bg-main)', borderRadius: 10, padding: '0.4rem 0.7rem', flex: 1 }}>
                      <p className="text-xs font-semibold text-purple">{c.user}</p>
                      <p className="text-sm text-main">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Input de nuevo comentario */}
            {activeComment === post.id && (
              <form
                onSubmit={(e) => addComment(e, post.id)}
                style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center' }}
              >
                <input
                  className="form-input"
                  placeholder="Escribe una respuesta..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  autoFocus
                  style={{ fontSize: '0.875rem', padding: '0.6rem 0.875rem' }}
                />
                <button type="submit" className="btn btn-mint btn-sm" disabled={!commentText.trim()}>
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
