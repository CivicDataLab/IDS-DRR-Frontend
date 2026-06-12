import { routes } from '@/lib/routes';

describe('routes', () => {
  it('builds analytics URLs with defaults', () => {
    expect(routes.analytics('assam')).toBe(
      '/assam/analytics/?indicator=risk-score&view=map'
    );
  });

  it('builds analytics URLs with custom view and time period', () => {
    expect(
      routes.analytics('bihar', { view: 'chart', timePeriod: '2025_03' })
    ).toBe(
      '/bihar/analytics/?indicator=risk-score&view=chart&time-period=2025_03'
    );
  });

  it('builds datasets URLs', () => {
    expect(routes.datasets()).toBe('/datasets?size=5&page=1&sort=recent');
    expect(routes.datasets({ category: 'climate' })).toBe(
      '/datasets?categories=climate'
    );
  });

  it('builds static and parameterized routes', () => {
    expect(routes.home).toBe('/');
    expect(routes.datasetDetail('my-dataset')).toBe('/datasets/my-dataset');
    expect(routes.glossary).toBe('/glossary');
    expect(routes.aboutUs).toBe('/about-us');
  });

  it('builds report URLs from env', () => {
    process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL =
      'https://data.example.com';
    expect(routes.report('IN-AS', '2025_03')).toBe(
      'https://data.example.com/report?geo_code=IN-AS&time_period=2025_03'
    );
  });
});
