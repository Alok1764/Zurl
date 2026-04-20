export async function mockGetGlobalStats() {
  return { totalLinks: 42105, totalClicks: 1420500 };
}

export async function mockGetLinkStats() {
  return { clicks: 42, locations: [], referrers: [] };
}
