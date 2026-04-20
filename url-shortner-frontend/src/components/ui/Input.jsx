import React from 'react';
import './Input.css';

export default function Input({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  type = 'text',
  error,
  hint,
  prefix,
  status,
  className = '',
  autoComplete,
  disabled = false,
  maxLength,
}) {
  const inputCls = [
    'input',
    prefix ? 'input--has-prefix' : '',
    status === 'error' || error ? 'input--error' : '',
    status === 'success' ? 'input--success' : '',
    status === 'checking' ? 'input--checking' : '',
    className,
  ].filter(Boolean).join(' ');

  // Compute prefix padding dynamically
  const prefixStyle = prefix ? { paddingLeft: `${prefix.length * 7.5 + 20}px` } : {};

  return (
    <div className="input-wrapper">
      {label && <label htmlFor={id} className="input-label">{label}</label>}
      <div className="input-field-wrap">
        {prefix && <span className="input-prefix" aria-hidden="true">{prefix}</span>}
        <input
          id={id}
          type={type}
          className={inputCls}
          style={prefixStyle}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={!!(error || status === 'error')}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />
      </div>
      {error && <p id={`${id}-error`} className="input-error-msg" role="alert">{error}</p>}
      {hint && !error && <p id={`${id}-hint`} className="input-hint">{hint}</p>}
    </div>
  );
}
