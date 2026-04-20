import { mockCreateLink, mockGetLinks, mockCheckAlias, mockDeleteLink } from '../mocks/links.mock.js';
import { USE_MOCK, APP_CONFIG } from '../config/api.config.js';

export async function createLink({ url, alias, expiresAt }) {
  if (USE_MOCK) return mockCreateLink({ url, alias, expiresAt });
  
  const res = await fetch(`${APP_CONFIG.apiBase}/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, alias, expiresAt }),
  });
  if (!res.ok) throw { status: res.status, ...(await res.json().catch(() => ({}))) };
  return res.json();
}

export async function getLinks() {
  if (USE_MOCK) return mockGetLinks();

  const res = await fetch(`${APP_CONFIG.apiBase}/links`);
  if (!res.ok) throw new Error('Failed to fetch links');
  return res.json();
}

export async function checkAlias(alias) {
  if (USE_MOCK) return mockCheckAlias(alias);

  const res = await fetch(`${APP_CONFIG.apiBase}/links/aliases/${alias}/check`);
  if (!res.ok) throw new Error('Failed to check alias');
  return res.json();
}

export async function deleteLink(shortCode) {
  if (USE_MOCK) return mockDeleteLink(shortCode);

  const res = await fetch(`${APP_CONFIG.apiBase}/links/${shortCode}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete link');
}
