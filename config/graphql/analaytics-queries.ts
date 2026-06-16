import { type DocumentType, graphql } from '@/gql/generated/analytics';

export const ANALYTICS_REVENUE_TABLE_DATA = graphql(`
  query revCircleViewData(
    $indcFilter: IndicatorFilter!
    $dataFilter: DataFilter!
    $geoFilter: GeoFilter!
  ) {
    revCircleViewData(
      indcFilter: $indcFilter
      dataFilter: $dataFilter
      geoFilter: $geoFilter
    )
  }
`);

export const ANALYTICS_DISTRICT_DATA = graphql(`
  query districtViewData(
    $indcFilter: IndicatorFilter!
    $dataFilter: DataFilter!
    $geoFilter: GeoFilter!
  ) {
    districtViewData(
      indcFilter: $indcFilter
      dataFilter: $dataFilter
      geoFilter: $geoFilter
    )
  }
`);

export const ANALYTICS_INDICATORS = graphql(`
  query indicators($indcFilter: IndicatorFilter, $stateCode: String) {
    indicators(indcFilter: $indcFilter, stateCode: $stateCode) {
      name
      slug
      short_description
      long_description
      unit__name
      IDS_dataSpace
    }
  }
`);

/** A single indicator as returned by the `indicators` query. */
export type Indicator = DocumentType<
  typeof ANALYTICS_INDICATORS
>['indicators'][number];

export const ANALYTICS_INDICATORS_BY_CATEGORY = graphql(`
  query indicatorsByCategory($stateCode: String) {
    indicatorsByCategory(stateCode: $stateCode) {
      slug
      name
      description
      IDS_dataSpace
      children {
        slug
        name
        description
        IDS_dataSpace
        children {
          slug
          name
          description
          IDS_dataSpace
        }
      }
    }
  }
`);

/**
 * A node in the indicator category tree. The query above fetches a bounded
 * depth (root -> pillar -> indicator); `children` is optional so the finite
 * generated result is assignable to this recursive shape without a cast.
 */
export interface IndicatorCategory {
  slug: string;
  name: string;
  description: string | null;
  IDS_dataSpace: string | null;
  children?: IndicatorCategory[];
}

export const ANALYTICS_TIME_PERIODS = graphql(`
  query dataTimePeriods {
    getDataTimePeriods {
      value
    }
  }
`);

export const ANALYTICS_GEOGRAPHY_DATA = graphql(`
  query getDistrictRevCircle($geoFilter: GeoFilter!) {
    getDistrictRevCircle(geoFilter: $geoFilter)
  }
`);

export const ANALYTICS_REVENUE_MAP_DATA = graphql(`
  query revenueCircleMapData(
    $indcFilter: IndicatorFilter!
    $dataFilter: DataFilter!
    $geoFilter: GeoFilter
  ) {
    revCircleMapData(
      indcFilter: $indcFilter
      dataFilter: $dataFilter
      geoFilter: $geoFilter
    )
  }
`);

export const ANALYTICS_DISTRICT_MAP_DATA = graphql(`
  query districtMapData(
    $indcFilter: IndicatorFilter!
    $dataFilter: DataFilter!
    $geoFilter: GeoFilter
  ) {
    districtMapData(
      indcFilter: $indcFilter
      dataFilter: $dataFilter
      geoFilter: $geoFilter
    )
  }
`);

export const ANALYTICS_TABLE_DATA = graphql(`
  query tableData(
    $indcFilter: IndicatorFilter
    $dataFilter: DataFilter
    $geoFilter: GeoFilter
  ) {
    tableData(
      indcFilter: $indcFilter
      dataFilter: $dataFilter
      geoFilter: $geoFilter
    )
  }
`);

export const PLATFORM_STATES_LIST = graphql(`
  query getStatesList {
    getStates {
      name
      slug
      code
      center
      bounds
      child_type
      resource_id
      time_periods
      latest_time_period
    }
  }
`);

/** A single state as returned by the `getStates` query. */
export type State = DocumentType<
  typeof PLATFORM_STATES_LIST
>['getStates'][number];
