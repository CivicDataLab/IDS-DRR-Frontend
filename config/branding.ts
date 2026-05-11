import * as namespace from 'ids-drr-branding';
import type { Exports } from 'ids-drr-branding-types';

// Widen each component slot to `ComponentType | undefined` so we can
// do e.g. `{Credits && <Credits />}` without TS warning that the value
// is always defined. Also serves as the contract conformance check. 
const branding: Exports = namespace;

export const {
  AboutPage,
  Credits,
  Footer,
  IntroSection,
  OutroSection,
  PartnerLogos,
} = branding;
