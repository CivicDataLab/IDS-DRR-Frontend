export type RasterQueryParams = {
  module: string;
  indicator: string;
  geography_code: string;
  period: string;
};

export type RasterValueParams = RasterQueryParams & {
  lat: number;
  lng: number;
};

export type RasterValueResponse = {
  module: string;
  indicator: string;
  geography_code: string;
  period: string;
  lat: number;
  lng: number;
  value: number | null;
  value_min?: number;
  value_max?: number;
  inside_raster: boolean;
  inside_geography: boolean;
};

export type RasterMetadata = {
  bounds: [number, number, number, number];
  minzoom: number;
  maxzoom: number;
  center: [number, number];
  tile_url_template: string;
  tiles?: string[];
  borders?: GeoJSON.FeatureCollection;
  geojson?: GeoJSON.FeatureCollection;
  value_min?: number;
  value_max?: number;
};

type RasterErrorResponse = {
  error?: string;
};

async function throwIfRasterError(res: Response, context: string): Promise<void> {
  if (res.ok) return;
  const { error } = (await res.json()) as RasterErrorResponse;
  throw new Error(error ?? `Raster ${context} ${res.status}`);
}

function rasterApiBase(): string {
  const base = process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL ?? '';
  return base.replace(/\/$/, '');
}

export function buildRasterMetadataUrl(params: RasterQueryParams): string {
  const url = new URL(`${rasterApiBase()}/raster/metadata`);
  url.searchParams.set('module', params.module);
  url.searchParams.set('indicator', params.indicator);
  url.searchParams.set('geography_code', params.geography_code);
  url.searchParams.set('period', params.period);
  return url.toString();
}

export function buildRasterValueUrl(params: RasterValueParams): string {
  const url = new URL(`${rasterApiBase()}/raster/value`);
  url.searchParams.set('module', params.module);
  url.searchParams.set('indicator', params.indicator);
  url.searchParams.set('geography_code', params.geography_code);
  url.searchParams.set('period', params.period);
  url.searchParams.set('lat', String(params.lat));
  url.searchParams.set('lng', String(params.lng));
  return url.toString();
}

export function resolveTileUrl(template: string, base: string): string {
  if (/^https?:\/\//i.test(template)) return template;
  return `${base}${template.startsWith('/') ? '' : '/'}${template}`;
}

/** bounds from API: [west, south, east, north] */
export function isInsideRasterBounds(
  lat: number,
  lng: number,
  bounds: RasterMetadata['bounds']
): boolean {
  const [west, south, east, north] = bounds;
  return lat >= south && lat <= north && lng >= west && lng <= east;
}

/** bounds from API: [west, south, east, north] */
export function leafletBounds(
  bounds: RasterMetadata['bounds']
): [[number, number], [number, number]] {
  const [west, south, east, north] = bounds;
  return [
    [south, west],
    [north, east],
  ];
}

export async function fetchRasterMetadata(
  params: RasterQueryParams
): Promise<RasterMetadata> {
  const base = rasterApiBase();
  if (!base) {
    throw new Error('NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL is not set');
  }

  const res = await fetch(buildRasterMetadataUrl(params));
  await throwIfRasterError(res, 'metadata');

  return (await res.json()) as RasterMetadata;
}

export async function fetchRasterValue(
  params: RasterValueParams
): Promise<RasterValueResponse> {
  const base = rasterApiBase();
  if (!base) {
    throw new Error('NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL is not set');
  }

  const res = await fetch(buildRasterValueUrl(params));
  await throwIfRasterError(res, 'value');

  return (await res.json()) as RasterValueResponse;
}

export function resolveRasterGeographyCode({
  stateCode,
  districtCode,
  revenueCode,
}: {
  stateCode?: string;
  districtCode?: string | null;
  revenueCode?: string | null;
}): string | null {
  if (revenueCode) return revenueCode;
  if (districtCode) return districtCode;
  return stateCode ?? null;
}

export function borderFeaturesFromMetadata(
  metadata: RasterMetadata | null | undefined
): GeoJSON.FeatureCollection | null {
  if (!metadata) return null;
  return metadata.borders ?? metadata.geojson ?? null;
}
