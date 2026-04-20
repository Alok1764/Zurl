import React, { useState } from 'react';
import { APP_CONFIG } from '../../config/api.config.js';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { useGlobalStats } from '../../hooks/useGlobalStats.js';
import { formatNumber } from '../../utils/formatters.js';
import './Footer.css';

export default function Footer() {
  const [open, setOpen] = useState(false);
  const { stats } = useGlobalStats();

  return (
    <>
      <footer className="footer" role="contentinfo">
        <span className="footer__left">
          © {new Date().getFullYear()} {APP_CONFIG.name}
        </span>
        <button id="footer-credit-btn" className="footer__credit" onClick={() => setOpen(true)}>
          {APP_CONFIG.footerCredit}
        </button>
      </footer>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={`About ${APP_CONFIG.name}`} maxWidth={400}>
        <div>
          <div className="about-modal__greeting">Hey, I'm {APP_CONFIG.creatorName} 👋</div>
          <p className="about-modal__bio">{APP_CONFIG.creatorBio}</p>
          {stats && (
            <div className="about-modal__stats">
              <div className="about-modal__stat">
                <span className="about-modal__stat-val">{formatNumber(stats.totalLinks)}</span>
                <span className="about-modal__stat-label">links created</span>
              </div>
              <div className="about-modal__stat">
                <span className="about-modal__stat-val">{formatNumber(stats.totalClicks)}</span>
                <span className="about-modal__stat-label">clicks tracked</span>
              </div>
            </div>
          )}
          <div className="about-modal__links">
            <Button id="about-twitter-btn" variant="secondary" size="sm" onClick={() => window.open(APP_CONFIG.twitterUrl, '_blank', 'noopener')}>
              𝕏 Twitter
            </Button>
            <Button id="about-github-btn" variant="secondary" size="sm" onClick={() => window.open(APP_CONFIG.githubUrl, '_blank', 'noopener')}>
              ⌥ GitHub
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
