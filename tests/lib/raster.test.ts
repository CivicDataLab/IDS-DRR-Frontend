import {
  buildRasterMetadataUrl,
  buildRasterValueUrl,
  isInsideRasterBounds,
  resolveRasterGeographyCode,
} from '@/lib/raster';

describe('raster helpers', () => {
  const originalBase = process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL;

  beforeAll(() => {
    process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL = 'http://localhost:8000';
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL = originalBase;
  });

  it('builds metadata URL with raster query params', () => {
    expect(
      buildRasterMetadataUrl({
        module: 'heat',
        indicator: 'land-surface-temperature',
        geography_code: '21-387',
        period: '2024_10',
      })
    ).toBe(
      'http://localhost:8000/raster/metadata?module=heat&indicator=land-surface-temperature&geography_code=21-387&period=2024_10'
    );
  });

  it('builds value URL with lat and lng', () => {
    expect(
      buildRasterValueUrl({
        module: 'heat',
        indicator: 'land-surface-temperature',
        geography_code: '21-387',
        period: '2024_10',
        lat: 19.835,
        lng: 85.773,
      })
    ).toBe(
      'http://localhost:8000/raster/value?module=heat&indicator=land-surface-temperature&geography_code=21-387&period=2024_10&lat=19.835&lng=85.773'
    );
  });

  it('checks whether a point is inside raster bounds', () => {
    const bounds: [number, number, number, number] = [80, 10, 90, 20];
    expect(isInsideRasterBounds(15, 85, bounds)).toBe(true);
    expect(isInsideRasterBounds(5, 85, bounds)).toBe(false);
    expect(isInsideRasterBounds(15, 95, bounds)).toBe(false);
  });

  it('resolves geography code from selection hierarchy', () => {
    expect(
      resolveRasterGeographyCode({
        stateCode: '21',
        districtCode: '21-387',
        revenueCode: '21-387-01',
      })
    ).toBe('21-387-01');

    expect(
      resolveRasterGeographyCode({
        stateCode: '21',
        districtCode: '21-387',
        revenueCode: null,
      })
    ).toBe('21-387');
  });
});
