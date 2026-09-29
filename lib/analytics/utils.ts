import { type Indicator } from '@/config/graphql/analaytics-queries';
import { getFactorRole } from '@/lib/analytics/factor-role';

export function getFactorNameBySlug(
  factorData: Indicator[] | undefined,
  slug: string
) {
  const factorName = factorData?.filter((factor) => factor.slug === slug);
  return factorName?.[0]?.name ?? slug;
}

/**
 * Government-response sub-indicators can arrive as both monthly and FY-cumsum
 * variants. Map/table should show only cumulative; chart only monthly.
 * Other parent indicators (e.g. risk-score) are left unchanged.
 */
export function filterSubIndicatorsForView(
  scoreTypes: string[],
  view: string,
  parentIndicator: string
): string[] {
  if (getFactorRole(parentIndicator) !== 'government-response') {
    return scoreTypes;
  }

  const isMapLike = !view || view === 'map' || view === 'table';
  const isChart = view === 'chart';

  return scoreTypes.filter((scoreType) => {
    const isCumsum = scoreType.endsWith('-fy-cumsum');

    if (isMapLike) {
      return !(!isCumsum && scoreTypes.includes(`${scoreType}-fy-cumsum`));
    }

    if (isChart) {
      const monthlySlug = scoreType.replace(/-fy-cumsum$/, '');
      return !(isCumsum && scoreTypes.includes(monthlySlug));
    }

    return true;
  });
}

export function getUnitsBySlug(
  factorData: Indicator[] | undefined,
  slug: string
) {
  const factorName = factorData?.filter((factor) => factor.slug === slug);
  return factorName?.[0]?.unit__name || '';
}

/** Returns the latest `YYYY_MM` period from a list (canonical API/URL format). */
export const getLatestDate = (dateStrings: string[]) => {
  const valid = (dateStrings || []).filter((dateStr) =>
    /^\d{4}_\d{2}$/.test(dateStr)
  );

  if (valid.length === 0) {
    return process.env.NEXT_PUBLIC_TIME_PERIOD || '2023_01';
  }

  const dates = valid.map((dateStr) => {
    const [year, month] = dateStr.split('_');
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  });

  const latestDate = new Date(Math.max(...dates.map((date) => date.getTime())));

  const year = latestDate.getFullYear();
  const month = String(latestDate.getMonth() + 1).padStart(2, '0');
  return `${year}_${month}`;
};
