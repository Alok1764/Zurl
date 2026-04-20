import React, { useState, useRef, useEffect } from 'react';
import useAuthStore from '../../store/authStore.js';
import { APP_CONFIG } from '../../config/api.config.js';
import './UserMenu.css';
import '../ui/Divider.css';

export default function UserMenu({ onLoginClick }) {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout = useAuthStore((s) => s.logout);
  const shotsLeft = useAuthStore((s) => s.shotsLeft);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!isLoggedIn) {
    return (
      <button id="topbar-login-btn" className="btn btn--secondary btn--sm" onClick={onLoginClick}>
        Login
      </button>
    );
  }

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const shots = shotsLeft();

  return (
    <div className="user-menu" ref={ref}>
      <button
        id="topbar-avatar-btn"
        className="avatar-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User menu"
      >
        {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.name} /> : initials}
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <div className="user-dropdown__header">
            <div className="user-dropdown__name">{user?.name}</div>
            <div className="user-dropdown__email">{user?.email}</div>
          </div>
          <button className="user-dropdown__item" role="menuitem" onClick={() => setOpen(false)}>👤 Profile</button>
          <button className="user-dropdown__item" role="menuitem" onClick={() => setOpen(false)}>🔗 My Links</button>
          <button className="user-dropdown__item" role="menuitem" onClick={() => setOpen(false)}>📊 Analytics</button>
          <div className="divider" style={{ margin: '4px 0' }} />
          <button
            className="user-dropdown__item user-dropdown__item--danger"
            role="menuitem"
            onClick={() => { logout(); setOpen(false); }}
          >
            ↩ Logout
          </button>
        </div>
      )}
    </div>
  );
}
