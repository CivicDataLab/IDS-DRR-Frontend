export const ANALYTICS_VIEWS = ['map', 'chart', 'table'] as const;
export type AnalyticsView = (typeof ANALYTICS_VIEWS)[number];

type AnalyticsOptions = {
  view?: AnalyticsView;
  // YYYY_MM, e.g. "2025_03". Omit to defer to the page's default
  // (i.e. latest available time period from the backend).
  timePeriod?: string;
};

type DatasetsOptions = {
  // Filter the list to one category.
  category?: string;
};

const qs = (params: Record<string, string>) =>
  new URLSearchParams(params).toString();

export const routes = {
  home: '/',

  analytics: (stateSlug: string, opts: AnalyticsOptions = {}) =>
    `/${stateSlug}/analytics/?${qs({
      indicator: 'risk-score',
      view: opts.view ?? 'map',
      ...(opts.timePeriod ? { 'time-period': opts.timePeriod } : {}),
    })}`,

  // Omit options for the default landing page (which sets size, page, sort).
  datasets: (opts: DatasetsOptions = {}) => {
    if (opts.category) return `/datasets?${qs({ categories: opts.category })}`;
    return `/datasets?${qs({ size: '5', page: '1', sort: 'recent' })}`;
  },

  datasetDetail: (datasetId: string) => `/datasets/${datasetId}`,

  glossary: '/glossary',

  aboutUs: '/about-us',

  privacyPolicy: '/privacy-policy',

  report: (geoCode: string, timePeriod: string) =>
    `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/report?${qs({
      geo_code: geoCode,
      time_period: timePeriod,
    })}`,
};
