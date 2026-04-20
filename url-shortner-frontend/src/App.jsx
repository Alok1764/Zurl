import React, { useEffect, useState } from 'react';
import TopBar from './components/layout/TopBar.jsx';
import Footer from './components/layout/Footer.jsx';
import GlobalStatsTicker from './components/stats/GlobalStatsTicker.jsx';
import URLForm from './components/shortener/URLForm.jsx';
import ResultCard from './components/result/ResultCard.jsx';
import ResultSkeleton from './components/result/ResultSkeleton.jsx';
import QRCard from './components/result/QRCard.jsx';
import RecentLinks from './components/stats/RecentLinks.jsx';
import AuthModal from './components/auth/AuthModal.jsx';
import ShotsBadge from './components/ui/ShotsBadge.jsx';
import { useShortener } from './hooks/useShortener.js';
import useAuthStore from './store/authStore.js';
import useLinksStore from './store/linksStore.js';
import { APP_CONFIG, USE_MOCK } from './config/api.config.js';
import { getLinks } from './api/links.js';
import './App.css';

export default function App() {
  const { status, result } = useShortener();
  const [showQR, setShowQR] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [headingFlash, setHeadingFlash] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const init = useAuthStore((s) => s.init);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const setRecentLinks = useLinksStore((s) => s.setRecentLinks);

  useEffect(() => { init(); }, [init]);

  useEffect(() => {
    if (isLoggedIn) {
      getLinks().then(setRecentLinks).catch(() => {});
    }
  }, [isLoggedIn, setRecentLinks]);

  useEffect(() => {
    if (status === 'success') {
      setHeadingFlash(true);
      setShowQR(false);
      const t = setTimeout(() => setHeadingFlash(false), 1500);
      return () => clearTimeout(t);
    }
  }, [status, result]);

  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {!isOnline && (
        <div className="offline-banner" role="alert">
          No connection — check your internet
        </div>
      )}

      <TopBar onLoginClick={() => setAuthOpen(true)} />

      <main>
        <ShotsBadge />
        {/* Hero */}
        <section className="hero" aria-labelledby="hero-heading">
          <GlobalStatsTicker />

          <h1
            id="hero-heading"
            className={`hero__heading${headingFlash ? ' hero__heading--flash' : ''}`}
          >
            {headingFlash ? (
              'Done. Here\'s your link.'
            ) : (
              <>
                Shorten links.<br />
                <span className="hero__heading-line2">No nonsense.</span>
              </>
            )}
          </h1>

          <p className="hero__sub">{APP_CONFIG.subTagline}</p>
        </section>

        {/* URL Form */}
        <URLForm
          onSuccess={() => {}}
          onShowQR={() => setShowQR(true)}
          onLoginRequired={() => setAuthOpen(true)}
        />

        {/* Result Area */}
        {(status === 'loading' || status === 'success') && (
          <section className="result-section" aria-label="Result" aria-live="polite">
            {status === 'loading' && <ResultSkeleton />}
            {status === 'success' && result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <ResultCard result={result} />
                {showQR && (
                  <QRCard shortUrl={result.shortUrl} shortCode={result.shortCode} />
                )}
              </div>
            )}
          </section>
        )}

        {/* Recent Links */}
        <RecentLinks />

        {/* Dev indicator */}
        {USE_MOCK && (
          <div className="dev-toggle" title="Mock mode — flip USE_MOCK in api.config.js">
            🔧 MOCK
          </div>
        )}
      </main>

      <Footer />

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
