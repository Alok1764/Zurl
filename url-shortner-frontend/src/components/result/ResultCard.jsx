import React from 'react';
import { APP_CONFIG } from '../../config/api.config.js';
import './ResultCard.css';
import '../ui/Card.css';
import CopyButton from '../ui/CopyButton.jsx';
import { formatNumber, formatDate, formatExpiry } from '../../utils/formatters.js';

export default function ResultCard({ result }) {
  if (!result) return null;
  const displayUrl = result.shortUrl.replace('https://', '');

  return (
    <div className="card result-card" aria-label="Shortened URL result">
      <div className="result-card__url-row">
        <a href={result.shortUrl} target="_blank" rel="noopener noreferrer" className="result-card__short-url" title={`Open ${result.shortUrl}`}>
          {displayUrl}
        </a>
        <CopyButton id="result-copy-btn" text={result.shortUrl} />
      </div>
      <div className="result-card__meta" aria-label="Link details">
        <span className="result-card__meta-item">↗ {formatNumber(result.clicks ?? 0)} {(result.clicks ?? 0) === 1 ? 'click' : 'clicks'}</span>
        <span style={{ color: 'var(--border-muted)' }}>·</span>
        <span className="result-card__meta-item">Expires: {formatExpiry(result.expiresAt)}</span>
        <span style={{ color: 'var(--border-muted)' }}>·</span>
        <span className="result-card__meta-item">{formatDate(result.createdAt)}</span>
      </div>
    </div>
  );
}
