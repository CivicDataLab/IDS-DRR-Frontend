import { config } from 'ids-drr-branding';
import type {
  Language,
  Resource,
  State,
  StaticImageAsset,
  Story,
  TileLayers,
} from 'ids-drr-branding-types';

import { routes } from '@/lib/routes';

// Arrays
export const states: State[] = config.states ?? [];
export const resources: Resource[] = config.resources ?? [];
export const stories: Story[] = config.stories ?? [];
export const languages: Language[] = config.languages ?? [];

// Images
export const logo: StaticImageAsset | undefined = config.logo;
export const heroForeground: StaticImageAsset | undefined =
  config.heroForeground;
export const heroBackground: string = config.heroBackground ?? '';
export const favicon: string = config.favicon ?? '';
export const appleIcon: string = config.appleIcon ?? '';
export const openGraphImage: string = config.openGraphImage ?? '';

// Map base layers
export const tileLayers: TileLayers | undefined = config.tileLayers;

// Links
// export const userGuideLink: string = config.userGuideLink ?? '';
export const userManualLink: string = config.userManualLink ?? '';
export const docsLink: string = config.docsLink ?? '';

// Content
export const glossaryCsv: string = config.glossaryCsv ?? '';

// English is always loaded internally as the missing-key fallback,
// but a deployment can omit it from `locales` to disable /en/ URLs.
export const FALLBACK_LOCALE = 'en';
export const locales: string[] = config.locales ?? [FALLBACK_LOCALE];
export const defaultLocale: string = config.defaultLocale ?? locales[0];
export const messages: Record<
  string,
  Record<string, unknown>
> = config.messages ?? {};

// Feature flags
const dataSpaceEnabled = Boolean(process.env.NEXT_PUBLIC_BACKEND_URL);
export const features = {
  chart: dataSpaceEnabled,
  datasets: dataSpaceEnabled,
  aboutUs: config.features?.aboutUs ?? false,
  reports: config.features?.reports ?? false,
  privacyPolicy: config.features?.privacyPolicy ?? false,
  glossary: Boolean(config.glossaryCsv),
};

// Navigation
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
  ...(features.glossary
    ? [{ key: 'glossary' as const, href: routes.glossary }]
    : []),
];
