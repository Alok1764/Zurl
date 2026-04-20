import React, { useState } from 'react';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import AliasInput from './AliasInput.jsx';
import ExpirySelector from './ExpirySelector.jsx';
import { useShortener } from '../../hooks/useShortener.js';
import { useToast } from '../../context/ToastContext.jsx';
import useAuthStore from '../../store/authStore.js';
import useLinksStore from '../../store/linksStore.js';
import { isValidUrl } from '../../utils/validators.js';
import './URLForm.css';
import '../ui/Card.css';

export default function URLForm({ onSuccess, onShowQR, onLoginRequired }) {
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [alias, setAlias] = useState('');
  const [expiry, setExpiry] = useState('never');
  const [expiresAt, setExpiresAt] = useState(null);

  const { status, shorten } = useShortener();
  const { addToast } = useToast();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const guestUsed = useLinksStore((s) => s.guestUsed);

  const isLoading = status === 'loading';
  const guestBlocked = !isLoggedIn && guestUsed;

  const handleUrlBlur = () => {
    if (url && !isValidUrl(url)) setUrlError("That doesn't look like a URL");
    else setUrlError('');
  };

  const handleExpiryChange = (val, iso) => { setExpiry(val); setExpiresAt(iso); };

  const doShorten = async () => {
    if (!url) { setUrlError('Paste a URL first'); return false; }
    if (!isValidUrl(url)) { setUrlError("That doesn't look like a URL"); return false; }
    setUrlError('');
    try {
      await shorten({ url, alias: alias || undefined, expiresAt });
      onSuccess?.();
      return true;
    } catch (err) {
      addToast({ message: err?.message || 'Something broke. Try again.', variant: 'error' });
      return false;
    }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    if (guestBlocked) { onLoginRequired?.(); return; }
    await doShorten();
  };

  const handleQR = async (e) => {
    e.preventDefault();
    if (status !== 'success') {
      const ok = await doShorten();
      if (!ok) return;
    }
    onShowQR?.();
  };

  const effectiveExpiry = isLoggedIn ? expiry : '24h';

  return (
    <div className="url-form-section">
      <div className="card url-form-card">
        <form className="url-form" onSubmit={handleShorten} noValidate>

          <Input
            id="url-input"
            label="Long URL"
            placeholder="Paste your monster URL here..."
            value={url}
            onChange={(e) => { setUrl(e.target.value); if (urlError) setUrlError(''); }}
            onBlur={handleUrlBlur}
            type="url"
            error={urlError}
            status={urlError ? 'error' : undefined}
            autoComplete="url"
          />

          <AliasInput value={alias} onChange={setAlias} />

          <ExpirySelector value={effectiveExpiry} onChange={handleExpiryChange} />

          <div className="form-actions">
            <Button
              id="shorten-btn"
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              onClick={guestBlocked ? () => onLoginRequired?.() : undefined}
            >
              {guestBlocked ? 'Login for more' : isLoading ? 'Shrinking' : 'Make it tiny'}
            </Button>
            <Button id="qr-btn" type="button" variant="secondary" fullWidth onClick={handleQR} disabled={isLoading}>
              Get QR code
            </Button>
          </div>

          {!isLoggedIn && (
            <p className="guest-note">
              No account? Your link lives for <span>24h.</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
