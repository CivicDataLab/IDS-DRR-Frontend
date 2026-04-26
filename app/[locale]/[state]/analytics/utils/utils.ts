import { parseDate, type CalendarDate } from '@internationalized/date';

import { numberLocale } from '@/config/site';

export function safeParseDate(value: string): CalendarDate | undefined {
  try {
    return parseDate(value);
  } catch {
    return undefined;
  }
}

export function getFactorNameBySlug(factorData: any, slug: string) {
  const factorName = factorData?.filter(
    (factor: { slug: string }) => factor.slug === slug
  );
  return factorName?.[0]?.name ?? slug;
}

export function getUnitsBySlug(factorData: any, slug: string) {
  const factorName = factorData?.filter(
    (factor: { slug: string }) => factor.slug === slug
  );
  return factorName?.[0]?.unit__name || '';
}

// Locale-aware number formatter. Grouping follows the deployment's
// numberLocale (e.g. "en-IN" -> "1,00,000"; "en-US" -> "100,000").
// Accepts numbers, numeric strings, or strings with a trailing unit
// ("12.5 mm"); in the last case the unit is preserved.
const numberFormatter = new Intl.NumberFormat(numberLocale || undefined, {
  maximumFractionDigits: 2,
});

export function formatNumber(input: number | string): string {
  if (input === undefined || input === null) return '';

  const str = input.toString();
  const match = str.match(/[\d.]+/);
  if (!match) return str;

  const number = parseFloat(match[0]);
  if (isNaN(number)) return str;

  const formatted = numberFormatter.format(number);
  const unit = str.replace(match[0], '').trim();
  return unit ? `${formatted} ${unit}` : formatted;
}


export const getLatestDate = (dateStrings: string[]) => {
  const valid = (dateStrings || []).filter((dateStr) => /^\d{4}_\d{2}$/.test(dateStr));

  if (valid.length === 0) {
    return process.env.NEXT_PUBLIC_TIME_PERIOD; // Handle empty array case
  }

  // Convert each 'yyyy_mm' string to a Date object
  const dates = valid.map((dateStr) => {
    const [year, month] = dateStr.split('_'); // Split into year and month
    return new Date(parseInt(year), parseInt(month) - 1); // Create a Date object (month is 0-indexed in JavaScript)
  });

  // Find the latest date
  const latestDate = new Date(
    Math.max(...dates.map((date) => date.getTime()))
  );

  // Convert the latest Date back to 'yyyy_mm' format
  const year = latestDate.getFullYear();
  const month = String(latestDate.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
  return `${year}-${month}-01`;
};
