import sitemap from '@/app/sitemap';

jest.mock('@/config/site', () => ({
  features: { datasets: true, aboutUs: true, glossary: false },
  locales: ['en'],
  siteUrl: 'https://example.com',
  states: [
    { slug: 'active-state', status: 'active' },
    { slug: 'draft-state', status: 'draft' },
  ],
}));

jest.mock('@/lib/api', () => ({
  fetchDatasets: jest.fn().mockResolvedValue({
    results: [{ id: 'dataset-1', modified: '2024-06-01T00:00:00Z' }],
  }),
}));

describe('sitemap', () => {
  it('builds URLs for home, analytics, datasets, and detail pages', async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain('https://example.com/en/');
    expect(urls.some((url) => url.includes('/active-state/analytics'))).toBe(
      true
    );
    expect(urls).not.toEqual(
      expect.arrayContaining([
        expect.stringContaining('/draft-state/analytics'),
      ])
    );
    expect(urls).toContain('https://example.com/en/datasets?size=5&page=1&sort=recent');
    expect(urls).toContain('https://example.com/en/about-us');
    expect(urls).toContain('https://example.com/en/datasets/dataset-1');
  });
});
