import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'serenify_posts';

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
 * Sección de comunidad con posts persistentes en localStorage.
 * Permite publicar mensajes, dar likes y comentar — visible en todos los
 * dispositivos que compartan el mismo navegador/almacenamiento.
 */
const Community = ({ userName }) => {
  const [posts, setPosts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_POSTS;
    } catch {
      return SEED_POSTS;
    }
  });

  const [newPost, setNewPost]           = useState('');
  const [activeComment, setActiveComment] = useState(null);  // id del post con input abierto
  const [commentText, setCommentText]   = useState('');

  // Persiste cambios en localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); } catch {}
  }, [posts]);

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
    setPosts(p => [post, ...p]);
    setNewPost('');
  };

  const toggleLike = (id) => {
    setPosts(p => p.map(post =>
      post.id !== id ? post : {
        ...post,
        likes: post.likedByUser ? post.likes - 1 : post.likes + 1,
        likedByUser: !post.likedByUser,
      }
    ));
  };

  const addComment = (e, postId) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const comment = { id: `c-${Date.now()}`, user: userName || 'Tú', text: commentText.trim() };
    setPosts(p => p.map(post =>
      post.id !== postId ? post : { ...post, comments: [...post.comments, comment] }
    ));
    setCommentText('');
    setActiveComment(null);
  };

  const deletePost = (id) => {
    setPosts(p => p.filter(post => post.id !== id));
  };

  return (
    <div>
      {/* Cabecera */}
      <header className="page-header">
        <h2>Comunidad de Apoyo</h2>
        <p>Comparte tu experiencia y acompaña a otros en su camino.</p>
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
          <button type="submit" className="btn btn-primary btn-sm" disabled={!newPost.trim()}>
            <Send size={16} />
            Publicar
          </button>
        </form>
        {newPost && (
          <p className="text-xs text-muted mt-2 text-right">{newPost.length}/280</p>
        )}
      </div>

      {/* Lista de posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.length === 0 && (
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
            {post.comments.length > 0 && (
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
