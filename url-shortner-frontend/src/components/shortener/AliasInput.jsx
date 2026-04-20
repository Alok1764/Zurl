import React from 'react';
import Input from '../ui/Input.jsx';
import { useAliasCheck } from '../../hooks/useAliasCheck.js';
import { APP_CONFIG } from '../../config/api.config.js';
import './AliasInput.css';

export default function AliasInput({ value, onChange }) {
  const { status, suggestion, validationError, onAliasChange } = useAliasCheck();

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    onAliasChange(val);
  };

  const inputStatus =
    status === 'available' ? 'success' :
    status === 'taken' || status === 'invalid' ? 'error' :
    status === 'checking' ? 'checking' : 'normal';

  const inputError = status === 'invalid' ? validationError : null;

  return (
    <div className="input-wrapper">
      <Input
        id="alias-input"
        label="Custom alias (optional)"
        placeholder="optional-alias"
        value={value}
        onChange={handleChange}
        prefix={`${APP_CONFIG.displayDomain} /`}
        status={inputStatus}
        error={inputError}
        maxLength={20}
        autoComplete="off"
      />
      {status === 'checking' && (
        <div className="alias-status alias-status--checking">
          Checking<span className="loading-dots" aria-hidden="true" />
        </div>
      )}
      {status === 'available' && value && (
        <div className="alias-status alias-status--available">✓ Available</div>
      )}
      {status === 'taken' && (
        <div className="alias-status alias-status--taken">
          ✗ Taken{suggestion ? ` — try: ${suggestion}` : ''}
        </div>
      )}
    </div>
  );
}
