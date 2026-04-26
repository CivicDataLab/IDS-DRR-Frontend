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
import type { Language, Resource, State } from 'ids-drr-branding-types';

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
export const heroImage: string = config.heroImage ?? '';
export const states: State[] = config.states ?? [];
export const resources: Resource[] = config.resources ?? [];
export const languages: Language[] = config.languages ?? [];
export const numberLocale: string = config.numberLocale ?? '';
export const reportsEnabled: boolean = config.reportsEnabled ?? false;

// Feature flags.
const backendAvailable = Boolean(process.env.NEXT_PUBLIC_BACKEND_URL);
export const features = {
  chart: backendAvailable,
  datasets: backendAvailable,
  aboutUs: Boolean(AboutPage),
};

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
