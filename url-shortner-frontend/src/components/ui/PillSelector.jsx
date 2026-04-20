import React from 'react';
import './PillSelector.css';

export default function PillSelector({ options, value, onChange, disabled = false }) {
  return (
    <div className="pill-group" role="group" aria-label="Select option">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`pill${value === opt.value ? ' pill--active' : ''}`}
          onClick={() => !opt.disabled && !disabled && onChange(opt.value)}
          disabled={opt.disabled || disabled}
          title={opt.tooltip || undefined}
          aria-pressed={value === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
