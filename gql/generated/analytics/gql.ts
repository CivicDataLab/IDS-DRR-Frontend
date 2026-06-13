/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query revCircleViewData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter!\n  ) {\n    revCircleViewData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n": typeof types.RevCircleViewDataDocument,
    "\n  query districtViewData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter!\n  ) {\n    districtViewData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n": typeof types.DistrictViewDataDocument,
    "\n  query indicators($indcFilter: IndicatorFilter, $stateCode: String) {\n    indicators(indcFilter: $indcFilter, stateCode: $stateCode) {\n      name\n      slug\n      short_description\n      long_description\n      unit__name\n      IDS_dataSpace\n    }\n  }\n": typeof types.IndicatorsDocument,
    "\n  query indicatorsByCategory($stateCode: String) {\n    indicatorsByCategory(stateCode: $stateCode) {\n      slug\n      name\n      description\n      IDS_dataSpace\n      children {\n        slug\n        name\n        description\n        IDS_dataSpace\n        children {\n          slug\n          name\n          description\n          IDS_dataSpace\n        }\n      }\n    }\n  }\n": typeof types.IndicatorsByCategoryDocument,
    "\n  query dataTimePeriods {\n    getDataTimePeriods {\n      value\n    }\n  }\n": typeof types.DataTimePeriodsDocument,
    "\n  query getDistrictRevCircle($geoFilter: GeoFilter!) {\n    getDistrictRevCircle(geoFilter: $geoFilter)\n  }\n": typeof types.GetDistrictRevCircleDocument,
    "\n  query revenueCircleMapData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter\n  ) {\n    revCircleMapData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n": typeof types.RevenueCircleMapDataDocument,
    "\n  query districtMapData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter\n  ) {\n    districtMapData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n": typeof types.DistrictMapDataDocument,
    "\n  query tableData(\n    $indcFilter: IndicatorFilter\n    $dataFilter: DataFilter\n    $geoFilter: GeoFilter\n  ) {\n    tableData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n": typeof types.TableDataDocument,
    "\n  query getStatesList {\n    getStates {\n      name\n      slug\n      code\n      center\n      bounds\n      child_type\n      resource_id\n      time_periods\n      latest_time_period\n    }\n  }\n": typeof types.GetStatesListDocument,
};
const documents: Documents = {
    "\n  query revCircleViewData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter!\n  ) {\n    revCircleViewData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n": types.RevCircleViewDataDocument,
    "\n  query districtViewData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter!\n  ) {\n    districtViewData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n": types.DistrictViewDataDocument,
    "\n  query indicators($indcFilter: IndicatorFilter, $stateCode: String) {\n    indicators(indcFilter: $indcFilter, stateCode: $stateCode) {\n      name\n      slug\n      short_description\n      long_description\n      unit__name\n      IDS_dataSpace\n    }\n  }\n": types.IndicatorsDocument,
    "\n  query indicatorsByCategory($stateCode: String) {\n    indicatorsByCategory(stateCode: $stateCode) {\n      slug\n      name\n      description\n      IDS_dataSpace\n      children {\n        slug\n        name\n        description\n        IDS_dataSpace\n        children {\n          slug\n          name\n          description\n          IDS_dataSpace\n        }\n      }\n    }\n  }\n": types.IndicatorsByCategoryDocument,
    "\n  query dataTimePeriods {\n    getDataTimePeriods {\n      value\n    }\n  }\n": types.DataTimePeriodsDocument,
    "\n  query getDistrictRevCircle($geoFilter: GeoFilter!) {\n    getDistrictRevCircle(geoFilter: $geoFilter)\n  }\n": types.GetDistrictRevCircleDocument,
    "\n  query revenueCircleMapData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter\n  ) {\n    revCircleMapData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n": types.RevenueCircleMapDataDocument,
    "\n  query districtMapData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter\n  ) {\n    districtMapData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n": types.DistrictMapDataDocument,
    "\n  query tableData(\n    $indcFilter: IndicatorFilter\n    $dataFilter: DataFilter\n    $geoFilter: GeoFilter\n  ) {\n    tableData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n": types.TableDataDocument,
    "\n  query getStatesList {\n    getStates {\n      name\n      slug\n      code\n      center\n      bounds\n      child_type\n      resource_id\n      time_periods\n      latest_time_period\n    }\n  }\n": types.GetStatesListDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query revCircleViewData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter!\n  ) {\n    revCircleViewData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n"): (typeof documents)["\n  query revCircleViewData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter!\n  ) {\n    revCircleViewData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query districtViewData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter!\n  ) {\n    districtViewData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n"): (typeof documents)["\n  query districtViewData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter!\n  ) {\n    districtViewData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query indicators($indcFilter: IndicatorFilter, $stateCode: String) {\n    indicators(indcFilter: $indcFilter, stateCode: $stateCode) {\n      name\n      slug\n      short_description\n      long_description\n      unit__name\n      IDS_dataSpace\n    }\n  }\n"): (typeof documents)["\n  query indicators($indcFilter: IndicatorFilter, $stateCode: String) {\n    indicators(indcFilter: $indcFilter, stateCode: $stateCode) {\n      name\n      slug\n      short_description\n      long_description\n      unit__name\n      IDS_dataSpace\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query indicatorsByCategory($stateCode: String) {\n    indicatorsByCategory(stateCode: $stateCode) {\n      slug\n      name\n      description\n      IDS_dataSpace\n      children {\n        slug\n        name\n        description\n        IDS_dataSpace\n        children {\n          slug\n          name\n          description\n          IDS_dataSpace\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query indicatorsByCategory($stateCode: String) {\n    indicatorsByCategory(stateCode: $stateCode) {\n      slug\n      name\n      description\n      IDS_dataSpace\n      children {\n        slug\n        name\n        description\n        IDS_dataSpace\n        children {\n          slug\n          name\n          description\n          IDS_dataSpace\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query dataTimePeriods {\n    getDataTimePeriods {\n      value\n    }\n  }\n"): (typeof documents)["\n  query dataTimePeriods {\n    getDataTimePeriods {\n      value\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getDistrictRevCircle($geoFilter: GeoFilter!) {\n    getDistrictRevCircle(geoFilter: $geoFilter)\n  }\n"): (typeof documents)["\n  query getDistrictRevCircle($geoFilter: GeoFilter!) {\n    getDistrictRevCircle(geoFilter: $geoFilter)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query revenueCircleMapData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter\n  ) {\n    revCircleMapData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n"): (typeof documents)["\n  query revenueCircleMapData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter\n  ) {\n    revCircleMapData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query districtMapData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter\n  ) {\n    districtMapData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n"): (typeof documents)["\n  query districtMapData(\n    $indcFilter: IndicatorFilter!\n    $dataFilter: DataFilter!\n    $geoFilter: GeoFilter\n  ) {\n    districtMapData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query tableData(\n    $indcFilter: IndicatorFilter\n    $dataFilter: DataFilter\n    $geoFilter: GeoFilter\n  ) {\n    tableData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n"): (typeof documents)["\n  query tableData(\n    $indcFilter: IndicatorFilter\n    $dataFilter: DataFilter\n    $geoFilter: GeoFilter\n  ) {\n    tableData(\n      indcFilter: $indcFilter\n      dataFilter: $dataFilter\n      geoFilter: $geoFilter\n    )\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getStatesList {\n    getStates {\n      name\n      slug\n      code\n      center\n      bounds\n      child_type\n      resource_id\n      time_periods\n      latest_time_period\n    }\n  }\n"): (typeof documents)["\n  query getStatesList {\n    getStates {\n      name\n      slug\n      code\n      center\n      bounds\n      child_type\n      resource_id\n      time_periods\n      latest_time_period\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;