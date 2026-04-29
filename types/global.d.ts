type IntlMessages = typeof import('../locales/en.json');

// Types derived from Messages are in global.d.ts for simplicity.
type RiskLevel = keyof IntlMessages['analytics']['risk'];
type NavLinkKey = keyof IntlMessages['nav']['links'];
