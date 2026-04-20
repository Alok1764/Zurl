import React from 'react';
import { APP_CONFIG } from '../../config/api.config.js';
import UserMenu from '../auth/UserMenu.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import './TopBar.css';

export default function TopBar({ onLoginClick }) {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <header className="topbar" role="banner">
      <div
        className="topbar__logo"
        onClick={scrollToTop}
        role="link"
        tabIndex={0}
        aria-label={`${APP_CONFIG.name} — go to top`}
        onKeyDown={(e) => e.key === 'Enter' && scrollToTop()}
      >
        {APP_CONFIG.logoText}
      </div>
      <div className="topbar__right">
        <ThemeToggle />
        <UserMenu onLoginClick={onLoginClick} />
      </div>
    </header>
  );
}
