import React, { useEffect, useState, useRef } from 'react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const applyTheme = (t) => {
      if (t === 'system') {
        const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', sysDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', t);
      }
    };
    applyTheme(theme);
    localStorage.setItem('theme', theme);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (theme === 'system') applyTheme('system'); };
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, [theme]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectTheme = (t) => {
    setTheme(t);
    setIsOpen(false);
  };

  const icons = {
    light: '☼',
    dark: '☾',
    system: '◑'
  };

  return (
    <div className="theme-toggle-wrap" ref={menuRef}>
      {isOpen && (
        <div className="theme-menu" role="menu">
          {['light', 'dark', 'system'].map(t => (
            <button 
              key={t}
              className={`theme-menu-item btn btn--ghost ${theme === t ? 'theme-menu-item--active' : ''}`}
              onClick={() => selectTheme(t)}
              role="menuitem"
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      )}
      <button 
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={`Theme: ${theme}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span 
          className="theme-icon"
          style={{ 
            transform: theme === 'system' ? 'scale(1.3)' : 'none'
          }}
        >
          {icons[theme]}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;
