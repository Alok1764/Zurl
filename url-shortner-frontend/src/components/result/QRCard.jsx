import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Button from '../ui/Button.jsx';
import './ResultCard.css';
import { getQRFilename } from '../../api/qr.js';
import useAuthStore from '../../store/authStore.js';

export default function QRCard({ shortUrl, shortCode }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const downloadQR = () => {
    if (!isLoggedIn) return;
    const canvas = document.querySelector('#qr-canvas canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = getQRFilename(shortCode);
    a.click();
  };

  return (
    <div className="card qr-card" aria-label="QR Code">
      <div id="qr-canvas" className="qr-card__canvas-wrap">
        <QRCodeCanvas value={shortUrl} size={180} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin={false} />
      </div>
      <Button id="qr-download-btn" variant="primary" size="sm" onClick={downloadQR} disabled={!isLoggedIn} title={isLoggedIn ? 'Download QR as PNG' : 'Login to download'}>
        ↓ Download PNG
      </Button>
      {!isLoggedIn && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center' }}>Login to download</p>}
    </div>
  );
}
