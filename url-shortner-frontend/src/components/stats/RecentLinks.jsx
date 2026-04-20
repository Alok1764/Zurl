import React from 'react';
import useLinksStore from '../../store/linksStore.js';
import useAuthStore from '../../store/authStore.js';
import './RecentLinks.css';
import CopyButton from '../ui/CopyButton.jsx';
import { truncateUrl, formatNumber } from '../../utils/formatters.js';

export default function RecentLinks() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const recentLinks = useLinksStore((s) => s.recentLinks);

  if (!recentLinks || recentLinks.length === 0) return null;

  // Guests only see 1 link; Members see top 5 on home page
  const displayLimit = isLoggedIn ? 5 : 1;
  const displayLinks = recentLinks.slice(0, displayLimit);
  const hasMore = isLoggedIn && recentLinks.length > 5;

  return (
    <section className="recent-section" aria-label="Recent links">
      <div className="recent-header">
        {isLoggedIn ? 'Your latest links' : 'Your link'}
      </div>
      <div className="recent-list">
        {displayLinks.map((link) => (
          <div key={link.shortCode} className="recent-row">
            <a href={link.shortUrl} target="_blank" rel="noopener noreferrer" className="recent-row__short" title={link.shortUrl}>
              {link.shortUrl.replace('https://', '')}
            </a>
            <span className="recent-row__dest" title={link.originalUrl}>{truncateUrl(link.originalUrl, 52)}</span>
            <span className="recent-row__clicks">{formatNumber(link.clicks)} {link.clicks === 1 ? 'click' : 'clicks'}</span>
            <CopyButton id={`copy-recent-${link.shortCode}`} text={link.shortUrl} />
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="recent-footer">
          <a href="#profile" className="profile-link">
            View all {recentLinks.length} links in your profile →
          </a>
        </div>
      )}
    </section>
  );
}
