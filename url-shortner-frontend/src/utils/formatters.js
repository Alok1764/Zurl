export function formatNumber(n) {
  if (typeof n !== 'number' || isNaN(n)) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function formatDate(iso) {
  if (!iso) return 'Unknown';
  const date = new Date(iso);
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatExpiry(iso) {
  if (!iso) return 'Never';
  const date = new Date(iso);
  const now = new Date();
  if (date < now) return 'Expired';
  const diffHr = Math.floor((date - now) / 3600000);
  const diffDay = Math.floor(diffHr / 24);
  if (diffHr < 24) return `${diffHr}h left`;
  if (diffDay < 30) return `${diffDay}d left`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function truncateUrl(url, maxLen = 48) {
  if (!url || url.length <= maxLen) return url;
  return url.substring(0, maxLen) + '…';
}
