import {
  borderFeaturesFromMetadata,
  buildRasterMetadataUrl,
  buildRasterValueUrl,
  fetchRasterMetadata,
  fetchRasterValue,
  isInsideRasterBounds,
  leafletBounds,
  resolveRasterGeographyCode,
  resolveTileUrl,
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

    expect(resolveRasterGeographyCode({ stateCode: '21' })).toBe('21');
    expect(resolveRasterGeographyCode({})).toBeNull();
  });

  it('resolves tile URLs against the API base', () => {
    expect(resolveTileUrl('https://tiles.example/{z}/{x}/{y}.png', 'http://localhost:8000')).toBe(
      'https://tiles.example/{z}/{x}/{y}.png'
    );
    expect(resolveTileUrl('/tiles/{z}/{x}/{y}.png', 'http://localhost:8000')).toBe(
      'http://localhost:8000/tiles/{z}/{x}/{y}.png'
    );
    expect(resolveTileUrl('tiles/{z}/{x}/{y}.png', 'http://localhost:8000')).toBe(
      'http://localhost:8000/tiles/{z}/{x}/{y}.png'
    );
  });

  it('converts API bounds to leaflet bounds', () => {
    expect(leafletBounds([80, 10, 90, 20])).toEqual([
      [10, 80],
      [20, 90],
    ]);
  });

  it('reads border features from raster metadata', () => {
    const borders = {
      type: 'FeatureCollection' as const,
      features: [{ type: 'Feature' as const, properties: {}, geometry: null }],
    };

    expect(borderFeaturesFromMetadata({ borders } as never)).toBe(borders);
    expect(borderFeaturesFromMetadata({ geojson: borders } as never)).toBe(
      borders
    );
    expect(borderFeaturesFromMetadata(null)).toBeNull();
  });

  it('fetches raster metadata and values from the API', async () => {
    const metadata = {
      bounds: [80, 10, 90, 20],
      minzoom: 6,
      maxzoom: 12,
      center: [85, 15],
      tile_url_template: '/tiles/{z}/{x}/{y}.png',
    };
    const valueResponse = {
      module: 'heat',
      indicator: 'land-surface-temperature',
      geography_code: '21',
      period: '2024_10',
      lat: 15,
      lng: 85,
      value: 32.5,
      inside_raster: true,
      inside_geography: true,
    };

    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => metadata,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => valueResponse,
      });
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      fetchRasterMetadata({
        module: 'heat',
        indicator: 'land-surface-temperature',
        geography_code: '21',
        period: '2024_10',
      })
    ).resolves.toEqual(metadata);

    await expect(
      fetchRasterValue({
        module: 'heat',
        indicator: 'land-surface-temperature',
        geography_code: '21',
        period: '2024_10',
        lat: 15,
        lng: 85,
      })
    ).resolves.toEqual(valueResponse);
  });

  it('throws when the API base URL is missing', async () => {
    const original = process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL;
    process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL = '';

    await expect(
      fetchRasterMetadata({
        module: 'heat',
        indicator: 'land-surface-temperature',
        geography_code: '21',
        period: '2024_10',
      })
    ).rejects.toThrow('NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL is not set');

    process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL = original;
  });

  it('throws when the raster API responds with an error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      text: async () => 'service unavailable',
    }) as unknown as typeof fetch;

    await expect(
      fetchRasterMetadata({
        module: 'heat',
        indicator: 'land-surface-temperature',
        geography_code: '21',
        period: '2024_10',
      })
    ).rejects.toThrow('Raster metadata 503: service unavailable');
  });
});
