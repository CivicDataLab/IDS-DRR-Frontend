import { type Indicator } from '@/config/graphql/analaytics-queries';

export function getFactorNameBySlug(
  factorData: Indicator[] | undefined,
  slug: string
) {
  const factorName = factorData?.filter((factor) => factor.slug === slug);
  return factorName?.[0]?.name ?? slug;
}

export function getUnitsBySlug(
  factorData: Indicator[] | undefined,
  slug: string
) {
  const factorName = factorData?.filter((factor) => factor.slug === slug);
  return factorName?.[0]?.unit__name || '';
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
