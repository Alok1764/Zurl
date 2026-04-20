import { mockLogin, mockRegister, mockGetUser, mockLogout } from '../mocks/auth.mock.js';
import { USE_MOCK, APP_CONFIG } from '../config/api.config.js';

export async function login(credentials) {
  if (USE_MOCK) return mockLogin(credentials);

  const res = await fetch(`${APP_CONFIG.apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function register(userData) {
  if (USE_MOCK) return mockRegister(userData);

  const res = await fetch(`${APP_CONFIG.apiBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export async function getUser() {
  if (USE_MOCK) return mockGetUser();

  const res = await fetch(`${APP_CONFIG.apiBase}/auth/me`);
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

export async function logout() {
  if (USE_MOCK) return mockLogout();

  const res = await fetch(`${APP_CONFIG.apiBase}/auth/logout`, { method: 'POST' });
  if (!res.ok) throw new Error('Logout failed');
}
