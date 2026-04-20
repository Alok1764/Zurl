export async function mockLogin() {
  return new Promise((resolve) => setTimeout(() => resolve({ id: '1', name: 'Alok Pal', email: 'alok@example.com', avatarUrl: null, dailyLimit: 50, linksUsedToday: 4 }), 1000));
}

export async function mockRegister() {
  return new Promise((resolve) => setTimeout(() => resolve({ id: '1', name: 'New User', email: 'new@example.com', avatarUrl: null, dailyLimit: 50, linksUsedToday: 0 }), 1000));
}

export async function mockGetUser() {
  return Promise.reject('Not authenticated'); // Initially not logged in mock
}

export async function mockLogout() {
  return Promise.resolve();
}
