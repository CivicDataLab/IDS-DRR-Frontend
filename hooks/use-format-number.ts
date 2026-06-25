import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

// Locale-aware number formatter. Accepts numbers, numeric strings, or strings
// with a trailing unit ("12.5 mm"), in which case the unit is preserved.
export function useFormatNumber(): (input: number | string) => string {
  const t = useTranslations('common');
  const numberLocale = t('numberLocale');
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(numberLocale || undefined, {
        maximumFractionDigits: 2,
      }),
    [numberLocale]
  );
  return useMemo(
    () => (input: number | string) => {
      if (input === undefined || input === null) return '';

      const str = input.toString();
      const match = str.match(/[\d.]+/);
      if (!match) return str;

      const number = parseFloat(match[0]);
      if (isNaN(number)) return str;

      const formatted = formatter.format(number);
      const unit = str.replace(match[0], '').trim();
      return unit ? `${formatted} ${unit}` : formatted;
    },
    [formatter]
  );
}
