import { AboutPage } from 'ids-drr-branding';
import { AboutUsURL, AnalyticsURL, DatasetsURL } from './consts';
import rawConfig from './site.generated.json';

export type SiteConfig = {
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

export type State = {
  name: string;
  slug: string;
  icon: string;
  alt: string;
  status: 'active' | 'coming_soon';
  // Optional GeoJSON overlay rendered on this state's analytics map.
  overlay_url?: string;
};

export type Resource = {
  title: string;
  source: string;
  last_updated: string;
  update_frequency: string;
  reference_period: string;
  url: string;
  tags: string[];
};

const config = rawConfig as {
  states?: State[];
  resources?: Resource[];
  reports_enabled?: boolean;
};

export const states: State[] = config.states ?? [];
export const resources: Resource[] = config.resources ?? [];
export const reportsEnabled: boolean = config.reports_enabled ?? false;

export const siteConfig: SiteConfig = {
  name: 'IDS-DRR',
  description:
    'Intelligent Data Solution for Disaster Risk Reduction (IDS-DRR) is an open-source platform that helps state-level and district-level Disaster Management Authorities to make timely data-driven decisions, prioritise expenditure of public funds and conduct public procurement in a manner that strengthens long-term disaster risk reduction and protects the most vulnerable people from the adverse effects of extreme weather events and climate change. ',
  url: process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : process.env.SITE_URL || '',
};

export const locales = ['en', 'hi'];

export const mainConfig: MainConfig = {
  homeUrl: '/',
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Analytics',
      href: `/assam${AnalyticsURL}`,
    },
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
