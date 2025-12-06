import React, { useEffect } from 'react';

export default function Toast({ msg, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [msg, duration, onClose]);

  if (!msg) return null;

  const bg = msg.type === 'success' ? '#198754' : '#dc3545'; // bootstrap green / red

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 99999 }}>
      <div style={{ background: bg, color: '#fff', padding: '10px 14px', borderRadius: 6, boxShadow: '0 6px 18px rgba(0,0,0,0.12)', minWidth: 240 }} role="status" aria-live="polite">
        {msg.text}
        <button onClick={onClose} aria-label="Close" style={{ marginLeft: 12, background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>×</button>
      </div>
    </div>
  );
}
