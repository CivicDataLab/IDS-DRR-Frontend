import { MainConfig, ServerUrlConfig, SiteConfig } from 'types';
import { AboutUsURL, AnalyticsURL, DatasetsURL } from './consts';

export const deployment: string =
  process.env.NEXT_PUBLIC_DEPLOYMENT || process.env.DEPLOYMENT || 'as';

export const siteConfig: SiteConfig = {
  name: 'IDS-DRR',
  description:
    'Intelligent Data Solution for Disaster Risk Reduction (IDS-DRR) is an open-source platform that helps state-level and district-level Disaster Management Authorities to make timely data-driven decisions, prioritise expenditure of public funds and conduct public procurement in a manner that strengthens long-term disaster risk reduction and protects the most vulnerable people from the adverse effects of extreme weather events and climate change. ',
  url: 'https://drr.open-contracting.in/en',
};

export const serverUrl: ServerUrlConfig = {
  'backend-url':
    process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || '',
  'data-management-url':
    process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL ||
    process.env.BACKEND_URL ||
    '',
};

export const mapPosition: {
  [key: string]: [string, string];
} = {
  morigaon: ['80%', '80%'],
};

export const locales = ['en', 'hi'];

export const backendUrl = {
  datasets: process.env.BACKEND_URL,
};

export const elasticSearchParams: { [key: string]: string } = {
  as: 'facets/?from=0&size=10&sort=desc&sort_by=relevance&q=Assam',
  hp: 'facets/?from=0&size=10&sort=desc&sort_by=relevance&q=Himachal Pradesh',
};

export const navbarConfig = {
  homeUrl: '/',
  links: [
    {
      label: 'Explore Departments',
      href: '/',
      icon: 'department',
    },
    {
      label: 'Explore Schemes',
      href: '/#',
      icon: 'scheme',
    },
  ],
};

export const mainConfig: MainConfig = {
  as: {
    homeUrl: '/',
    mainNav: [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'Analytics',
        href: AnalyticsURL,
      },
      {
        title: 'Datasets',
        href: DatasetsURL,
      },
      {
        title: 'About us',
        href: AboutUsURL,
      },
    ],
  },
  od: {
    homeUrl: '/',
    mainNav: [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'Datasets',
        href: DatasetsURL,
      },
      {
        title: 'About us',
        href: AboutUsURL,
      },
    ],
  },
  hp: {
    homeUrl: '/',
    mainNav: [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'Datasets',
        href: DatasetsURL,
      },
      {
        title: 'About us',
        href: AboutUsURL,
      },
    ],
  },
};
