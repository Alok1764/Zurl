import React from 'react';
import { useClipboard } from '../../hooks/useClipboard.js';
import './CopyButton.css';

export default function CopyButton({ text, id }) {
  const { copied, copy } = useClipboard(2000);
  return (
    <button
      id={id}
      type="button"
      className={`copy-btn${copied ? ' copy-btn--copied' : ''}`}
      onClick={() => copy(text)}
      aria-label={copied ? 'Copied!' : 'Copy link'}
    >
      {copied ? 'Copied! ✓' : 'Copy'}
    </button>
  );
}
