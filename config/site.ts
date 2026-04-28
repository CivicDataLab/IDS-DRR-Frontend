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
export const openGraphImage: string = config.openGraphImage ?? '';
export const favicon: string = config.favicon ?? '';
export const appleIcon: string = config.appleIcon ?? '';
export const states: State[] = config.states ?? [];
export const resources: Resource[] = config.resources ?? [];
export const languages: Language[] = config.languages ?? [];
export const reportsEnabled: boolean = config.reportsEnabled ?? false;

// English is always loaded internally as the missing-key fallback,
// but a deployment can omit it from `locales` to disable /en/ URLs.
export const FALLBACK_LOCALE = 'en';
export const locales: string[] = config.locales ?? [FALLBACK_LOCALE];
export const defaultLocale: string = config.defaultLocale ?? locales[0];
export const messages: Record<string, Record<string, unknown>> =
  config.messages ?? {};

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

export const mainNav: { key: NavLinkKey; href: string }[] = [
  { key: 'home', href: routes.home },
  ...(defaultState
    ? [{ key: 'analytics' as const, href: routes.analytics(defaultState.slug) }]
    : []),
  ...(features.datasets
    ? [{ key: 'datasets' as const, href: routes.datasets() }]
    : []),
  ...(features.aboutUs
    ? [{ key: 'aboutUs' as const, href: routes.aboutUs }]
    : []),
];
