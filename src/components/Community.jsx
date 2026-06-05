import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, MessageCircle, Send, Trash2, RefreshCw } from 'lucide-react';

const API_URL = 'https://api.restful-api.dev/objects/ff8081819d82fab6019e966a64cb40b9';

const SEED_POSTS = [
  {
    id: 'seed-1',
    user: 'Dra. Elena Rostova',
    content: 'Recuerden que tomar pequeñas pausas de 2 minutos cada hora no es un lujo, es una necesidad para la mente. 🌿',
    likes: 45,
    likedBy: [],
    comments: [],
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'seed-2',
    user: 'María G.',
    content: 'Hoy probé la respiración guiada de 5 minutos antes de mi reunión y la diferencia fue enorme. ¡Totalmente recomendada! 💚',
    likes: 14,
    likedBy: [],
    comments: [],
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'seed-3',
    user: 'Carlos M.',
    content: '¿Alguien tiene tips para el insomnio por estrés laboral? Estoy buscando nuevas estrategias 😓',
    likes: 8,
    likedBy: [],
    comments: [{ id: 'c1', user: 'Lic. Mateo Vargas', text: 'Te recomiendo la sesión de relajación nocturna en la app 🌙' }],
    createdAt: Date.now() - 1800000,
  },
];

/**
 * Formato humano del tiempo transcurrido
 */
const timeAgo = (ts) => {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'ahora';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
};

/**
 * Comunidad con sincronización global en tiempo real vía REST API.
 *
 * Arquitectura:
 * - Polling cada 4s para traer posts nuevos de otros dispositivos.
 * - Al hacer una acción local (post, like, comment, delete),
 *   se PAUSA el polling, se aplica el cambio, se sube al servidor,
 *   y LUEGO se retoma el polling. Esto evita la condición de carrera
 *   donde el GET sobreescribe cambios locales.
 */
const Community = ({ userName }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText] = useState('');

  // Ref mutable para bloquear polls mientras hay escritura en curso
  const writingRef = useRef(false);

  /**
   * Trae los posts del servidor. Solo actualiza el estado
   * si NO hay una escritura en curso (para no pisarla).
   */
  const fetchPosts = useCallback(async () => {
    if (writingRef.current) return;
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('fetch failed');
      const json = await res.json();

      if (writingRef.current) return; // re-check después del await

      if (json.data?.posts && json.data.posts.length > 0) {
        setPosts(json.data.posts);
      } else {
        // Primera vez: poblar con datos semilla
        await syncToServer(SEED_POSTS);
        setPosts(SEED_POSTS);
      }
    } catch (err) {
      console.warn('Serenify: Error al leer posts:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Envía el array completo de posts al servidor (PUT).
   */
  const syncToServer = async (data) => {
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'serenify_posts_v1', data: { posts: data } }),
      });
      if (!res.ok) throw new Error('sync failed');
    } catch (err) {
      console.warn('Serenify: Error al sincronizar:', err.message);
    }
  };

  /**
   * Ejecuta una mutación de forma segura:
   * 1. Bloquea el polling
   * 2. Aplica el cambio al estado local
   * 3. Sube al servidor
   * 4. Desbloquea el polling
   */
  const safeUpdate = async (updater) => {
    writingRef.current = true;
    setIsSyncing(true);
    try {
      const next = updater(posts);
      setPosts(next);
      await syncToServer(next);
    } finally {
      writingRef.current = false;
      setIsSyncing(false);
    }
  };

  // Carga inicial + polling
  useEffect(() => {
    fetchPosts();
    const id = setInterval(fetchPosts, 4000);
    return () => clearInterval(id);
  }, [fetchPosts]);

  /* ================================================================
     ACCIONES DE USUARIO
     ================================================================ */

  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    const text = newPost.trim();
    setNewPost('');

    const post = {
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      user: userName || 'Tú',
      content: text,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: Date.now(),
    };

    safeUpdate((prev) => [post, ...prev]);
  };

  const handleToggleLike = (id) => {
    safeUpdate((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const already = (p.likedBy || []).includes(userName);
        return {
          ...p,
          likes: already ? p.likes - 1 : p.likes + 1,
          likedBy: already
            ? (p.likedBy || []).filter((u) => u !== userName)
            : [...(p.likedBy || []), userName],
        };
      })
    );
  };

  const handleAddComment = (e, postId) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const text = commentText.trim();
    setCommentText('');
    setActiveComment(null);

    const comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      user: userName || 'Tú',
      text,
    };

    safeUpdate((prev) =>
      prev.map((p) =>
        p.id !== postId ? p : { ...p, comments: [...p.comments, comment] }
      )
    );
  };

  const handleDelete = (id) => {
    safeUpdate((prev) => prev.filter((p) => p.id !== id));
  };

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div>
      {/* Cabecera */}
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2>Comunidad Global</h2>
          <p>Publicaciones en tiempo real entre todos los dispositivos 🌍</p>
        </div>
        <div className="flex items-center gap-2">
          {isSyncing && (
            <span className="text-xs text-muted flex items-center gap-1">
              <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Guardando...
            </span>
          )}
          {isLoading && <span className="text-xs text-mint">Conectando...</span>}
        </div>
      </header>

      {/* ---- Formulario de publicación ---- */}
      <div className="glass-card mb-6">
        <form onSubmit={handleAddPost} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label" htmlFor="new-post-input">¿Qué tienes en mente hoy?</label>
            <textarea
              id="new-post-input"
              className="form-input"
              rows={2}
              placeholder="Comparte algo con la comunidad..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              style={{ resize: 'none' }}
              maxLength={280}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={!newPost.trim() || isSyncing}>
            <Send size={16} />
            Publicar
          </button>
        </form>
        {newPost && (
          <p className="text-xs text-muted mt-2 text-right">{newPost.length}/280</p>
        )}
      </div>

      {/* ---- Lista de posts ---- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {posts.length === 0 && !isLoading && (
          <p className="text-muted text-center" style={{ padding: '2rem 0' }}>
            Sé el primero en compartir algo 💬
          </p>
        )}

        {posts.map((post) => {
          const userLiked = (post.likedBy || []).includes(userName);

          return (
            <div key={post.id} className="post-card">
              {/* Autor */}
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

                {post.user === userName && !post.id.startsWith('seed') && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    aria-label="Eliminar publicación"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}
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
                  className={userLiked ? 'liked' : ''}
                  onClick={() => handleToggleLike(post.id)}
                  aria-label={userLiked ? 'Quitar like' : 'Dar like'}
                >
                  <Heart size={16} fill={userLiked ? 'currentColor' : 'none'} />
                  {post.likes}
                </button>
                <button
                  onClick={() => {
                    setActiveComment(activeComment === post.id ? null : post.id);
                    setCommentText('');
                  }}
                  aria-label="Responder"
                >
                  <MessageCircle size={16} />
                  {post.comments.length} {post.comments.length === 1 ? 'respuesta' : 'respuestas'}
                </button>
              </div>

              {/* Comentarios existentes */}
              {post.comments.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {post.comments.map((c) => (
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
                  onSubmit={(e) => handleAddComment(e, post.id)}
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
                  <button type="submit" className="btn btn-mint btn-sm" disabled={!commentText.trim() || isSyncing}>
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Community;
