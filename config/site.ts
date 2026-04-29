import * as branding from 'ids-drr-branding';
import type {
  Exports,
  Language,
  Resource,
  StaticImageAsset,
  State,
} from 'ids-drr-branding-types';

import { routes } from '@/lib/routes';

// Catch missing or wrong-typed exports at compile-time, not runtime.
const validated: Exports = branding;

const { config } = validated;

// Re-export branding-provided components and values so the rest of the app
// imports all deployment-specific things from one place.
export const About = validated.About;
export const AboutPage = validated.AboutPage;
export const Credits = validated.Credits;
export const DataStories = validated.DataStories;
export const Footer = validated.Footer;
export const Partners = validated.Partners;
export const PartnerLogos = validated.PartnerLogos;
// Arrays
export const states: State[] = config.states ?? [];
export const resources: Resource[] = config.resources ?? [];
export const languages: Language[] = config.languages ?? [];
// Images
export const logo: StaticImageAsset | undefined = config.logo;
export const heroForeground: StaticImageAsset | undefined = config.heroForeground;
export const heroBackground: string = config.heroBackground ?? '';
export const favicon: string = config.favicon ?? '';
export const appleIcon: string = config.appleIcon ?? '';
export const openGraphImage: string = config.openGraphImage ?? '';
// Links
export const userGuideLink: string = config.userGuideLink ?? '';
export const docsLink: string = config.docsLink ?? '';
// Feature flags
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
