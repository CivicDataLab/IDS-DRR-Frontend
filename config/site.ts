import { AboutPage } from 'ids-drr-branding';
import { AnalyticsURL } from './consts';
import rawConfig from './site.generated.json';

export type MainNavItem = {
  // Message key under `nav.*` in locales/<locale>.json.
  titleKey: string;
  href: string;
  icon?: string;
};

export type MainConfig = {
  homeUrl: string;
  mainNav: MainNavItem[];
};

type State = {
  name: string;
  slug: string;
  icon: string;
  status: 'active' | 'coming_soon';
  // Optional GeoJSON overlay rendered on this state's analytics map.
  overlay_url?: string;
};

type Resource = {
  title: string;
  source: string;
  last_updated: string;
  update_frequency: string;
  reference_period: string;
  url: string;
  tags: string[];
};

type Language = {
  label: string;
  value: string;
};

const config = rawConfig as {
  states?: State[];
  resources?: Resource[];
  languages?: Language[];
  hero_image?: string;
  reports_enabled?: boolean;
  number_locale?: string;
};

export const states: State[] = config.states ?? [];
export const resources: Resource[] = config.resources ?? [];
export const languages: Language[] = config.languages ?? [];
export const heroImage: string = config.hero_image ?? '';
export const reportsEnabled: boolean = config.reports_enabled ?? false;
export const numberLocale: string = config.number_locale ?? '';

const defaultState = states.find((s) => s.status === 'active');

export const siteUrl =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : process.env.SITE_URL || '';

export const mainConfig: MainConfig = {
  homeUrl: '/',
  mainNav: [
    {
      titleKey: 'home',
      href: '/',
    },
    ...(defaultState
      ? [
          {
            titleKey: 'analytics',
            href: `/${defaultState.slug}${AnalyticsURL}`,
          },
        ]
      : []),
    ...(process.env.NEXT_PUBLIC_BACKEND_URL
      ? [
          {
            titleKey: 'datasets',
            href: `/datasets?size=5&page=1&sort=recent`,
          },
        ]
      : []),
    ...(AboutPage
      ? [
          {
            titleKey: 'aboutUs',
            href: '/about-us',
          },
        ]
      : []),
  ],
};
