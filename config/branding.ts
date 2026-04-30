import {
  About,
  AboutPage,
  config,
  Credits,
  DataStories,
  Footer,
  PartnerLogos,
  Partners,
} from 'ids-drr-branding';
import type { Exports } from 'ids-drr-branding-types';

// Catch missing or wrong-typed exports at compile-time, not runtime.
({
  About,
  AboutPage,
  config,
  Credits,
  DataStories,
  Footer,
  PartnerLogos,
  Partners,
}) satisfies Exports;

export {
  About,
  AboutPage,
  Credits,
  DataStories,
  Footer,
  PartnerLogos,
  Partners,
};
