import React, { useState } from 'react';
import PillSelector from '../ui/PillSelector.jsx';
import useAuthStore from '../../store/authStore.js';

const BASE_OPTIONS = [
  { label: '24h',     value: '24h' },
  { label: '7 days',  value: '7d' },
  { label: '30 days', value: '30d' },
  { label: 'Never',   value: 'never' },
  { label: 'Custom',  value: 'custom' },
];

function getExpiresAt(value, customDate) {
  if (!value || value === 'never') return null;
  if (value === 'custom') return customDate || null;
  const now = new Date();
  if (value === '24h') now.setHours(now.getHours() + 24);
  if (value === '7d')  now.setDate(now.getDate() + 7);
  if (value === '30d') now.setDate(now.getDate() + 30);
  return now.toISOString();
}

export default function ExpirySelector({ value, onChange }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [customDate, setCustomDate] = useState('');

  const options = BASE_OPTIONS.map((o) =>
    !isLoggedIn && o.value !== '24h'
      ? { ...o, disabled: true, tooltip: 'Login to unlock more expiry options' }
      : o
  );

  const handlePillChange = (val) => {
    onChange(val, getExpiresAt(val, customDate ? new Date(customDate).toISOString() : null));
  };

  const handleCustomDate = (e) => {
    setCustomDate(e.target.value);
    onChange('custom', e.target.value ? new Date(e.target.value).toISOString() : null);
  };

  return (
    <div className="expiry-section">
      <span className="expiry-label">Expires in</span>
      <PillSelector options={options} value={value} onChange={handlePillChange} />
      {value === 'custom' && isLoggedIn && (
        <div className="custom-date-wrap">
          <input
            id="expiry-custom-date"
            type="datetime-local"
            className="custom-date-input"
            value={customDate}
            onChange={handleCustomDate}
            min={new Date().toISOString().slice(0, 16)}
            aria-label="Custom expiry date and time"
          />
        </div>
      )}
    </div>
  );
}
