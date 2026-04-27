// Use type safe message keys with `next-intl`
type Messages = typeof import('../locales/en.json');
declare interface IntlMessages extends Messages {}

// Types derived from IntlMessages are in global.d.ts for simplicity.
type RiskLevel = keyof IntlMessages['analytics']['risk'];
type NavLinkKey = keyof IntlMessages['nav']['links'];
