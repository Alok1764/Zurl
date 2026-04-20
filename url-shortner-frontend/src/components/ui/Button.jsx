import React from 'react';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  id,
  title,
  className = '',
}) {
  const cls = [
    'btn',
    `btn--${variant}`,
    size === 'sm' ? 'btn--sm' : size === 'lg' ? 'btn--lg' : '',
    fullWidth ? 'btn--full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      id={id}
      type={type}
      className={cls}
      disabled={disabled || loading}
      onClick={onClick}
      title={title}
    >
      {loading ? (
        <><span>{children}</span><span className="loading-dots" aria-hidden="true" /></>
      ) : children}
    </button>
  );
}
