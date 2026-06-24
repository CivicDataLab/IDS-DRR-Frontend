import { routes } from '@/lib/routes';

describe('routes', () => {
  it('builds analytics URLs with defaults', () => {
    expect(routes.analytics('assam', 'flood')).toBe(
      '/assam/flood/analytics/?indicator=risk-score&view=map'
    );
  });

  it('builds analytics URLs with custom view and time period', () => {
    expect(
      routes.analytics('bihar', 'flood', {
        view: 'chart',
        timePeriod: '2025_03',
      })
    ).toBe(
      '/bihar/flood/analytics/?indicator=risk-score&view=chart&time-period=2025_03'
    );
  });

  it('builds module-specific root indicators', () => {
    expect(routes.analytics('assam', 'heat')).toBe(
      '/assam/heat/analytics/?indicator=heat-risk-score&view=map'
    );
    expect(
      routes.analytics('assam', 'heat', {
        view: 'table',
        timePeriod: '2025_01',
      })
    ).toBe(
      '/assam/heat/analytics/?indicator=heat-risk-score&view=table&time-period=2025_01'
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
    expect(routes.state('assam')).toBe('/assam');
    expect(routes.state('himachal-pradesh')).toBe('/himachal-pradesh');
    expect(routes.datasetDetail('my-dataset')).toBe('/datasets/my-dataset');
    expect(routes.glossary).toBe('/glossary');
    expect(routes.aboutUs).toBe('/about-us');
    expect(routes.privacyPolicy).toBe('/privacy-policy');
  });

  it('builds report URLs from env', () => {
    process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL =
      'https://data.example.com';
    expect(routes.report('IN-AS', '2025_03')).toBe(
      'https://data.example.com/report?geo_code=IN-AS&time_period=2025_03'
    );
  });
});
