import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, MessageCircle, Send, Trash2, RefreshCw } from 'lucide-react';

/**
 * URL del almacenamiento JSON global persistente (JSONBlob.com).
 * Todos los dispositivos leen y escriben al mismo blob.
 */
const BLOB_ID = '019e9673-d5e5-71f0-89b3-c8a1218814e0';
const API_URL = `https://jsonblob.com/api/jsonBlob/${BLOB_ID}`;

/** Posts semilla para poblar la comunidad la primera vez */
const SEED_POSTS = [
  {
    id: 'seed-1',
    user: 'Dra. Elena Rostova',
    content: 'Recuerden que tomar pequeñas pausas de 2 minutos cada hora no es un lujo, es una necesidad para la mente. 🌿',
    likes: 45, likedBy: [],
    comments: [],
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'seed-2',
    user: 'María G.',
    content: 'Hoy probé la respiración guiada de 5 minutos antes de mi reunión y la diferencia fue enorme. ¡Totalmente recomendada! 💚',
    likes: 14, likedBy: [],
    comments: [],
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'seed-3',
    user: 'Carlos M.',
    content: '¿Alguien tiene tips para el insomnio por estrés laboral? Estoy buscando nuevas estrategias 😓',
    likes: 8, likedBy: [],
    comments: [
      { id: 'c1', user: 'Lic. Mateo Vargas', text: 'Te recomiendo la sesión de relajación nocturna en la app 🌙' }
    ],
    createdAt: Date.now() - 1800000,
  },
];

/** Formato de tiempo relativo */
const timeAgo = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'ahora';
  if (s < 3600) return `hace ${Math.floor(s / 60)} min`;
  if (s < 86400) return `hace ${Math.floor(s / 3600)} h`;
  return `hace ${Math.floor(s / 86400)} d`;
};

/**
 * Comunidad con persistencia real y sincronización entre dispositivos.
 *
 * Usa JSONBlob.com como base de datos JSON gratuita y persistente.
 * - GET cada 4s para traer cambios de otros dispositivos (polling).
 * - PUT después de cada acción local para guardar el cambio.
 * - Se bloquea el polling mientras se escribe para evitar sobreescrituras.
 */
const Community = ({ userName }) => {
  const [posts, setPosts]               = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [isSyncing, setIsSyncing]       = useState(false);
  const [newPost, setNewPost]           = useState('');
  const [activeComment, setActiveComment] = useState(null);
  const [commentText, setCommentText]   = useState('');

  /** Ref para bloquear polling durante escrituras */
  const writeLock = useRef(false);
  /** Ref con el estado más reciente de posts (evita closures obsoletos) */
  const postsRef  = useRef(posts);
  useEffect(() => { postsRef.current = posts; }, [posts]);

  /* ===========================================================
     LECTURA: trae posts del servidor
     =========================================================== */
  const fetchPosts = useCallback(async () => {
    // No leer si hay una escritura en curso
    if (writeLock.current) return;

    try {
      const res = await fetch(API_URL, {
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error(`GET ${res.status}`);

      // Doble-check después del await (pudo empezar una escritura)
      if (writeLock.current) return;

      const json = await res.json();
      const serverPosts = json.posts;

      if (Array.isArray(serverPosts) && serverPosts.length > 0) {
        setPosts(serverPosts);
      } else if (isLoading) {
        // Primera carga y blob vacío → poblar con semillas
        await saveToServer(SEED_POSTS);
        setPosts(SEED_POSTS);
      }
    } catch (err) {
      console.warn('[Serenify] Error al leer:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  /* ===========================================================
     ESCRITURA: guarda posts en el servidor
     =========================================================== */
  const saveToServer = async (data) => {
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: data }),
      });
      if (!res.ok) throw new Error(`PUT ${res.status}`);
    } catch (err) {
      console.warn('[Serenify] Error al guardar:', err.message);
    }
  };

  /**
   * Aplica una mutación de forma segura:
   * 1. Bloquea el polling
   * 2. Calcula el nuevo estado usando postsRef (nunca obsoleto)
   * 3. Actualiza la UI de inmediato
   * 4. Sube al servidor
   * 5. Desbloquea el polling
   */
  const mutate = useCallback(async (updater) => {
    writeLock.current = true;
    setIsSyncing(true);
    try {
      const next = updater(postsRef.current);
      setPosts(next);
      postsRef.current = next;
      await saveToServer(next);
    } finally {
      writeLock.current = false;
      setIsSyncing(false);
    }
  }, []);

  /* ===========================================================
     POLLING: carga inicial + intervalo cada 4 segundos
     =========================================================== */
  useEffect(() => {
    fetchPosts();
    const id = setInterval(fetchPosts, 4000);
    return () => clearInterval(id);
  }, [fetchPosts]);

  /* ===========================================================
     ACCIONES DEL USUARIO
     =========================================================== */

  /** Publicar un nuevo post */
  const handleAddPost = (e) => {
    e.preventDefault();
    const text = newPost.trim();
    if (!text) return;
    setNewPost('');

    mutate((prev) => [{
      id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      user: userName,
      content: text,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: Date.now(),
    }, ...prev]);
  };

  /** Dar / quitar like */
  const handleLike = (postId) => {
    mutate((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const arr = p.likedBy || [];
        const liked = arr.includes(userName);
        return {
          ...p,
          likes: liked ? p.likes - 1 : p.likes + 1,
          likedBy: liked ? arr.filter((u) => u !== userName) : [...arr, userName],
        };
      })
    );
  };

  /** Añadir un comentario a un post */
  const handleComment = (e, postId) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    setCommentText('');
    setActiveComment(null);

    mutate((prev) =>
      prev.map((p) =>
        p.id !== postId
          ? p
          : {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  user: userName,
                  text,
                },
              ],
            }
      )
    );
  };

  /** Eliminar un post propio */
  const handleDelete = (postId) => {
    mutate((prev) => prev.filter((p) => p.id !== postId));
  };

  /* ===========================================================
     RENDER
     =========================================================== */
  return (
    <div>
      {/* Cabecera */}
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2>Comunidad Global</h2>
          <p>Publicaciones en tiempo real entre todos los dispositivos 🌍</p>
        </div>
        {isSyncing && (
          <span className="text-xs text-muted flex items-center gap-1">
            <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Guardando…
          </span>
        )}
      </header>

      {/* ---- Formulario de nuevo post ---- */}
      <div className="glass-card mb-6">
        <form onSubmit={handleAddPost} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label" htmlFor="community-input">¿Qué tienes en mente hoy?</label>
            <textarea
              id="community-input"
              className="form-input"
              rows={2}
              placeholder="Comparte algo con la comunidad…"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              maxLength={280}
              style={{ resize: 'none' }}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={!newPost.trim() || isSyncing}>
            <Send size={16} /> Publicar
          </button>
        </form>
        {newPost && <p className="text-xs text-muted mt-2 text-right">{newPost.length}/280</p>}
      </div>

      {/* ---- Skeleton de carga ---- */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2].map((i) => (
            <div key={i} className="post-card" style={{ opacity: 0.5 }}>
              <div style={{ height: 14, width: '40%', background: 'var(--border-color)', borderRadius: 6, marginBottom: 12 }} />
              <div style={{ height: 14, width: '80%', background: 'var(--border-color)', borderRadius: 6, marginBottom: 8 }} />
              <div style={{ height: 14, width: '60%', background: 'var(--border-color)', borderRadius: 6 }} />
            </div>
          ))}
        </div>
      )}

      {/* ---- Lista de posts ---- */}
      {!isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {posts.length === 0 && (
            <p className="text-muted text-center" style={{ padding: '2rem 0' }}>
              Sé el primero en compartir algo 💬
            </p>
          )}

          {posts.map((post) => {
            const userLiked = (post.likedBy || []).includes(userName);
            const isOwn = post.user === userName && !post.id.startsWith('seed');

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
                  {isOwn && (
                    <button onClick={() => handleDelete(post.id)} aria-label="Eliminar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}>
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                {/* Contenido */}
                <p className="text-main" style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.875rem' }}>
                  {post.content}
                </p>

                {/* Acciones: Like + Comment */}
                <div className="post-actions flex items-center gap-2">
                  <button className={userLiked ? 'liked' : ''} onClick={() => handleLike(post.id)} aria-label={userLiked ? 'Quitar like' : 'Dar like'}>
                    <Heart size={16} fill={userLiked ? 'currentColor' : 'none'} /> {post.likes}
                  </button>
                  <button onClick={() => { setActiveComment(activeComment === post.id ? null : post.id); setCommentText(''); }} aria-label="Comentar">
                    <MessageCircle size={16} /> {post.comments.length} {post.comments.length === 1 ? 'respuesta' : 'respuestas'}
                  </button>
                </div>

                {/* Hilo de comentarios existentes */}
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

                {/* Input para nuevo comentario */}
                {activeComment === post.id && (
                  <form onSubmit={(e) => handleComment(e, post.id)} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center' }}>
                    <input
                      className="form-input"
                      placeholder="Escribe una respuesta…"
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
      )}
    </div>
  );
};

export default Community;
