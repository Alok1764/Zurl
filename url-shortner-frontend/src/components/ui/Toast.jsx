import React, { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, variant = 'info', onClose }) {
  const icon = { error: '✕', success: '✓', info: 'ℹ', warning: '⚠' }[variant] || 'ℹ';
  return (
    <div className={`toast toast--${variant}`} role="alert" aria-atomic="true">
      <span style={{ fontSize: '0.85rem', flexShrink: 0 }} aria-hidden="true">{icon}</span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Dismiss">✕</button>
    </div>
  );
}
