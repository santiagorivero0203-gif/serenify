import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * Toast de notificación temporal.
 * @param {string} title
 * @param {string} message
 * @param {function} onClose - callback al auto-cerrar
 * @param {number} duration - ms que dura (default 3000)
 */
const Toast = ({ title, message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className="toast" role="status" aria-live="polite">
      <CheckCircle size={22} />
      <div>
        <h4>{title}</h4>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;
