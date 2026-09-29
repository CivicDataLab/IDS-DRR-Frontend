import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  ANALYTICS_DISTRICT_MAP_DATA,
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_TIME_PERIODS,
  PLATFORM_STATES_LIST,
} from '@/config/graphql/analaytics-queries';
import {
  countDistricts,
  countVeryHighRiskDistricts,
} from '@/lib/analytics/module-hub-stats';
import { getRootIndicatorSlug } from '@/lib/analytics/root-indicator';
import { GraphQL } from '@/lib/api';

const graphqlUrl = `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`;

/** Hub card stats: district list + very-high-risk count from map features. */
export function useModuleHubStats(
  stateSlug: string | undefined,
  moduleSlug: string
) {
  const rootIndicator = getRootIndicatorSlug(stateSlug, moduleSlug);
  const enabled = Boolean(stateSlug && moduleSlug);

  const statesList = useQuery({
    queryKey: [`states_list_${moduleSlug}`],
    queryFn: () =>
      GraphQL(graphqlUrl, PLATFORM_STATES_LIST, { module: moduleSlug }),
    enabled,
  });

  const state = statesList.data?.getStates?.find(
    (item: { slug: string }) => item.slug === stateSlug
  );
  const stateCode = state?.code as string | undefined;

  const timePeriods = useQuery({
    queryKey: [`timePeriods`, moduleSlug, stateCode],
    queryFn: () =>
      GraphQL(graphqlUrl, ANALYTICS_TIME_PERIODS, {
        module: moduleSlug,
        stateCode,
      }),
    enabled: Boolean(stateCode),
  });

  const timePeriod =
    timePeriods.data?.getDataTimePeriods?.[0]?.value ??
    state?.latest_time_period ??
    process.env.NEXT_PUBLIC_TIME_PERIOD;

  const districtGeographies = useQuery({
    queryKey: [`geographies_data_district_${stateCode}`],
    queryFn: () => {
      if (!stateCode) {
        throw new Error('District geography query requires state code');
      }

      return GraphQL(graphqlUrl, ANALYTICS_GEOGRAPHY_DATA, {
        geoFilter: { type: 'district', code: [stateCode] },
      });
    },
    enabled: Boolean(stateCode),
  });

  const mapData = useQuery({
    queryKey: [
      `mapQuery_district_${stateCode}_${rootIndicator}_${timePeriod}`,
    ],
    queryFn: () => {
      if (!stateCode || !timePeriod) {
        throw new Error('Map query requires state code and time period');
      }

      return GraphQL(graphqlUrl, ANALYTICS_DISTRICT_MAP_DATA, {
        indcFilter: { slug: rootIndicator, module: moduleSlug },
        dataFilter: { dataPeriod: timePeriod },
        geoFilter: { code: [stateCode] },
      });
    },
    enabled: Boolean(stateCode && timePeriod),
  });

  const districtCount = useMemo(
    () => countDistricts(districtGeographies.data?.getDistrictRevCircle),
    [districtGeographies.data?.getDistrictRevCircle]
  );

  const veryHighRiskCount = useMemo(
    () =>
      countVeryHighRiskDistricts(
        mapData.data?.districtMapData,
        rootIndicator
      ),
    [mapData.data?.districtMapData, rootIndicator]
  );

  const isLoading =
    statesList.isLoading ||
    districtGeographies.isLoading ||
    mapData.isLoading;

  return { districtCount, veryHighRiskCount, isLoading };
}
