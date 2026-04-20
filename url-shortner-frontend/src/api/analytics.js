import { mockGetGlobalStats, mockGetLinkStats } from '../mocks/analytics.mock.js';
import { USE_MOCK, APP_CONFIG } from '../config/api.config.js';

export async function getGlobalStats() {
  if (USE_MOCK) return mockGetGlobalStats();

  const res = await fetch(`${APP_CONFIG.apiBase}/analytics/global`);
  if (!res.ok) throw new Error('Failed to fetch global stats');
  return res.json();
}

export async function getLinkStats(shortCode) {
  if (USE_MOCK) return mockGetLinkStats(shortCode);

  const res = await fetch(`${APP_CONFIG.apiBase}/analytics/${shortCode}`);
  if (!res.ok) throw new Error('Failed to fetch link stats');
  return res.json();
}
