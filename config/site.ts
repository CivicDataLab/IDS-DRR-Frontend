import rawConfig from './site.generated.json';

import {
  AboutPage,
  Credits,
  DataStories,
  Footer,
  HomeAbout,
  HomePartners,
  PartnerLogos,
  config,
} from 'ids-drr-branding';

import { routes } from '@/lib/routes';

// Re-export branding-provided components and values so the rest of the app
// imports all deployment-specific things from one place.
export {
  AboutPage,
  Credits,
  DataStories,
  Footer,
  HomeAbout,
  HomePartners,
  PartnerLogos,
};

// Feature flags.
const backendAvailable = Boolean(process.env.NEXT_PUBLIC_BACKEND_URL);
export const features = {
  chart: backendAvailable,
  datasets: backendAvailable,
  aboutUs: Boolean(AboutPage),
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

// Navigation.
const defaultState = states.find((s) => s.status === 'active');

export const siteUrl =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : process.env.SITE_URL || '';

export const mainNav = [
  { titleKey: 'home', href: routes.home },
  ...(defaultState
    ? [{ titleKey: 'analytics', href: routes.analytics(defaultState.slug) }]
    : []),
  ...(features.datasets
    ? [{ titleKey: 'datasets', href: routes.datasets() }]
    : []),
  ...(features.aboutUs
    ? [{ titleKey: 'aboutUs', href: routes.aboutUs }]
    : []),
];
