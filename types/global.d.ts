import { formats } from '@/i18n/formats';
import messages from '@/locales/en.json';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages;
    Formats: typeof formats;
  }
}

declare global {
  type IntlMessages = typeof messages;
  type RiskLevel = keyof IntlMessages['analytics']['risk'];
  type NavLinkKey = keyof IntlMessages['nav']['links'];
}

declare module '*.csv' {
  const content: string;
  export default content;
}
