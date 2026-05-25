import { useFormatter, useTranslations } from 'next-intl';

// Formats an ISO date string as a month-year string, e.g. "September 2024"
// in en-US. Blank inputs fall back to the localized `common.na` message.
export function useFormatPeriod() {
  const t = useTranslations('common');
  const format = useFormatter();
  return (input: string | null | undefined): string =>
    input ? format.dateTime(new Date(input), 'monthYear') : t('na');
}
