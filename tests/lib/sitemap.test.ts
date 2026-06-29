import sitemap from '@/app/sitemap';

jest.mock('@/lib/state-map-config', () => ({
  getStateBranding: jest.fn((slug: string | undefined) => {
    if (!slug) return undefined;
    const { states } = jest.requireMock('@/config/site');
    return states.find((state: { slug: string }) => state.slug === slug);
  }),
  hasSubDistrictSupport: jest.fn(() => true),
}));

jest.mock('@/config/site', () => ({
  features: { datasets: true, aboutUs: true, privacyPolicy: true, glossary: false },
  locales: ['en'],
  siteUrl: 'https://example.com',
  states: [
    {
      slug: 'active-state',
      status: 'active',
      modules: [{ slug: 'flood', status: 'active' }],
    },
    { slug: 'draft-state', status: 'draft', modules: [] },
  ],
}));

jest.mock('@/lib/api', () => ({
  fetchDatasets: jest.fn().mockResolvedValue({
    results: [{ id: 'dataset-1', modified: '2024-06-01T00:00:00Z' }],
  }),
}));

describe('sitemap', () => {
  it('builds URLs for home, state hubs, analytics, datasets, and detail pages', async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain('https://example.com/en/');
    expect(urls).toContain('https://example.com/en/active-state');
    expect(urls.some((url) => url.includes('/active-state/flood/analytics'))).toBe(
      true
    );
    expect(urls).not.toEqual(
      expect.arrayContaining([
        expect.stringContaining('/draft-state/flood/analytics'),
      ])
    );
    expect(urls).toContain('https://example.com/en/datasets?size=5&page=1&sort=recent');
    expect(urls).toContain('https://example.com/en/about-us');
    expect(urls).toContain('https://example.com/en/privacy-policy');
    expect(urls).toContain('https://example.com/en/datasets/dataset-1');
  });
});
