export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch { return false; }
}

export function isValidAlias(alias) {
  if (!alias) return true;
  const t = alias.trim();
  if (t.length < 3 || t.length > 20) return false;
  return /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(t) || /^[a-zA-Z0-9]{1,2}$/.test(t);
}

export function getAliasError(alias) {
  if (!alias) return null;
  const t = alias.trim();
  if (t.length < 3) return 'Alias must be at least 3 characters';
  if (t.length > 20) return 'Alias must be 20 characters or less';
  if (!/^[a-zA-Z0-9-]+$/.test(t)) return 'Only letters, numbers, and hyphens';
  if (t.startsWith('-') || t.endsWith('-')) return 'Cannot start or end with a hyphen';
  return null;
}
