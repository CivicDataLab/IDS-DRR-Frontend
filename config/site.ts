import { AboutPage } from 'ids-drr-branding';
import { AboutUsURL, AnalyticsURL, DatasetsURL } from './consts';
import rawConfig from './site.generated.json';

type SiteConfig = {
  name: string;
  description: string;
  url: string;
};

export type MainNavItem = {
  title: string;
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
  alt: string;
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

export const siteConfig: SiteConfig = {
  name: 'IDS-DRR',
  description:
    'Intelligent Data Solution for Disaster Risk Reduction (IDS-DRR) is an open-source platform that helps state-level and district-level Disaster Management Authorities to make timely data-driven decisions, prioritise expenditure of public funds and conduct public procurement in a manner that strengthens long-term disaster risk reduction and protects the most vulnerable people from the adverse effects of extreme weather events and climate change. ',
  url: process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : process.env.SITE_URL || '',
};

export const mainConfig: MainConfig = {
  homeUrl: '/',
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
    ...(defaultState
      ? [
          {
            title: 'Analytics',
            href: `/${defaultState.slug}${AnalyticsURL}`,
          },
        ]
      : []),
    ...(process.env.NEXT_PUBLIC_BACKEND_URL
      ? [
          {
            title: 'Datasets',
            href: DatasetsURL,
          },
        ]
      : []),
    ...(AboutPage
      ? [
          {
            title: 'About us',
            href: AboutUsURL,
          },
        ]
      : []),
  ],
};
