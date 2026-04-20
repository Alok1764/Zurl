export async function mockCreateLink({ url, alias, expiresAt }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (alias === 'taken') reject({ status: 409, message: 'Alias taken' });
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        originalUrl: url,
        shortCode: alias || Math.random().toString(36).substr(2, 6),
        shortUrl: `https://zurl.co/${alias || Math.random().toString(36).substr(2, 6)}`,
        clicks: 0,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt || null,
      });
    }, 800);
  });
}

export async function mockGetLinks() {
  return [
    { originalUrl: 'https://example.com/very/long/path/to/something/important', shortCode: 'ex1', shortUrl: 'https://zurl.co/ex1', clicks: 124 },
    { originalUrl: 'https://github.com/alokpal/zurl', shortCode: 'gh1', shortUrl: 'https://zurl.co/gh1', clicks: 42 },
  ];
}

export async function mockCheckAlias(alias) {
  return new Promise((resolve) => setTimeout(() => resolve({ available: alias !== 'taken', suggestion: alias === 'taken' ? 'taken-1' : null }), 400));
}

export async function mockDeleteLink() {
  return Promise.resolve();
}
