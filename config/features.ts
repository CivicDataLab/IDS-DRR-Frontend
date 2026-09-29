import { config } from 'ids-drr-branding';

const dataSpaceEnabled = Boolean(process.env.NEXT_PUBLIC_BACKEND_URL);

/** Deployment feature flags (kept separate from site.ts to avoid import cycles). */
export const features = {
  chart: dataSpaceEnabled,
  datasets: dataSpaceEnabled,
  aboutUs: config.features?.aboutUs ?? false,
  reports: config.features?.reports ?? false,
  privacyPolicy: config.features?.privacyPolicy ?? false,
  glossary: Boolean(config.glossaryCsv),
};
