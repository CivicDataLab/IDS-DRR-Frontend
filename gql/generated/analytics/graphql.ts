/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type CustomDataPeriodList = {
  __typename?: 'CustomDataPeriodList';
  value: Scalars['String'];
};

/** Data(id, value, added, modified, indicator, geography, scheme, data_period) */
export type DataFilter = {
  AND?: InputMaybe<DataFilter>;
  OR?: InputMaybe<DataFilter>;
  dataPeriod?: InputMaybe<Scalars['String']>;
  period?: InputMaybe<Scalars['String']>;
};

/** Geography(id, name, code, type, parentId, geom, slug) */
export type GeoFilter = {
  AND?: InputMaybe<GeoFilter>;
  OR?: InputMaybe<GeoFilter>;
  code?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

/** Indicators(id, name, long_description, short_description, category, type, slug, unit, geography, department, data_source, scheme, parent, display_order, is_visible) */
export type IndicatorFilter = {
  AND?: InputMaybe<IndicatorFilter>;
  OR?: InputMaybe<IndicatorFilter>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  districtMapData: Scalars['JSON'];
  districtViewData: Scalars['JSON'];
  getDataTimePeriods: Array<CustomDataPeriodList>;
  getDistrictRevCircle: Scalars['JSON'];
  getStates: Scalars['JSON'];
  getTimeTrends: Scalars['JSON'];
  indicators: Scalars['JSON'];
  indicatorsByCategory: Scalars['JSON'];
  revCircleMapData: Scalars['JSON'];
  revCircleViewData: Scalars['JSON'];
  tableData: Scalars['JSON'];
};


export type QueryDistrictMapDataArgs = {
  dataFilter: DataFilter;
  geoFilter?: InputMaybe<GeoFilter>;
  indcFilter: IndicatorFilter;
};


export type QueryDistrictViewDataArgs = {
  dataFilter: DataFilter;
  geoFilter: GeoFilter;
  indcFilter: IndicatorFilter;
};


export type QueryGetDistrictRevCircleArgs = {
  geoFilter: GeoFilter;
};


export type QueryGetTimeTrendsArgs = {
  dataFilter: DataFilter;
  geoFilter: GeoFilter;
  indcFilter: IndicatorFilter;
};


export type QueryIndicatorsArgs = {
  indcFilter?: InputMaybe<IndicatorFilter>;
  stateCode?: InputMaybe<Scalars['Int']>;
};


export type QueryIndicatorsByCategoryArgs = {
  parentId?: InputMaybe<Scalars['Int']>;
  stateCode?: InputMaybe<Scalars['String']>;
};


export type QueryRevCircleMapDataArgs = {
  dataFilter: DataFilter;
  geoFilter?: InputMaybe<GeoFilter>;
  indcFilter: IndicatorFilter;
};


export type QueryRevCircleViewDataArgs = {
  dataFilter: DataFilter;
  geoFilter?: InputMaybe<GeoFilter>;
  indcFilter: IndicatorFilter;
};


export type QueryTableDataArgs = {
  dataFilter?: InputMaybe<DataFilter>;
  geoFilter?: InputMaybe<GeoFilter>;
  indcFilter?: InputMaybe<IndicatorFilter>;
};

export type RevCircleViewDataQueryVariables = Exact<{
  indcFilter: IndicatorFilter;
  dataFilter: DataFilter;
  geoFilter: GeoFilter;
}>;


export type RevCircleViewDataQuery = { __typename?: 'Query', revCircleViewData: any };

export type DistrictViewDataQueryVariables = Exact<{
  indcFilter: IndicatorFilter;
  dataFilter: DataFilter;
  geoFilter: GeoFilter;
}>;


export type DistrictViewDataQuery = { __typename?: 'Query', districtViewData: any };

export type IndicatorsQueryVariables = Exact<{
  indcFilter?: InputMaybe<IndicatorFilter>;
  stateCode?: InputMaybe<Scalars['Int']>;
}>;


export type IndicatorsQuery = { __typename?: 'Query', indicators: any };

export type IndicatorsByCategoryQueryVariables = Exact<{
  stateCode?: InputMaybe<Scalars['String']>;
}>;


export type IndicatorsByCategoryQuery = { __typename?: 'Query', indicatorsByCategory: any };

export type DataTimePeriodsQueryVariables = Exact<{ [key: string]: never; }>;


export type DataTimePeriodsQuery = { __typename?: 'Query', getDataTimePeriods: Array<{ __typename?: 'CustomDataPeriodList', value: string }> };

export type GetDistrictRevCircleQueryVariables = Exact<{
  geoFilter: GeoFilter;
}>;


export type GetDistrictRevCircleQuery = { __typename?: 'Query', getDistrictRevCircle: any };

export type RevenueCircleMapDataQueryVariables = Exact<{
  indcFilter: IndicatorFilter;
  dataFilter: DataFilter;
  geoFilter?: InputMaybe<GeoFilter>;
}>;


export type RevenueCircleMapDataQuery = { __typename?: 'Query', revCircleMapData: any };

export type DistrictMapDataQueryVariables = Exact<{
  indcFilter: IndicatorFilter;
  dataFilter: DataFilter;
  geoFilter?: InputMaybe<GeoFilter>;
}>;


export type DistrictMapDataQuery = { __typename?: 'Query', districtMapData: any };

export type TableDataQueryVariables = Exact<{
  indcFilter?: InputMaybe<IndicatorFilter>;
  dataFilter?: InputMaybe<DataFilter>;
  geoFilter?: InputMaybe<GeoFilter>;
}>;


export type TableDataQuery = { __typename?: 'Query', tableData: any };

export type GetStatesListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatesListQuery = { __typename?: 'Query', getStates: any };


export const RevCircleViewDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"revCircleViewData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"indcFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IndicatorFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dataFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DataFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"geoFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeoFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revCircleViewData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"indcFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"indcFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"dataFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dataFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"geoFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geoFilter"}}}]}]}}]} as unknown as DocumentNode<RevCircleViewDataQuery, RevCircleViewDataQueryVariables>;
export const DistrictViewDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"districtViewData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"indcFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IndicatorFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dataFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DataFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"geoFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeoFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"districtViewData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"indcFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"indcFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"dataFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dataFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"geoFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geoFilter"}}}]}]}}]} as unknown as DocumentNode<DistrictViewDataQuery, DistrictViewDataQueryVariables>;
export const IndicatorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"indicators"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"indcFilter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IndicatorFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stateCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indicators"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"indcFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"indcFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"stateCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stateCode"}}}]}]}}]} as unknown as DocumentNode<IndicatorsQuery, IndicatorsQueryVariables>;
export const IndicatorsByCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"indicatorsByCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stateCode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indicatorsByCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stateCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stateCode"}}}]}]}}]} as unknown as DocumentNode<IndicatorsByCategoryQuery, IndicatorsByCategoryQueryVariables>;
export const DataTimePeriodsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"dataTimePeriods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDataTimePeriods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<DataTimePeriodsQuery, DataTimePeriodsQueryVariables>;
export const GetDistrictRevCircleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getDistrictRevCircle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"geoFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GeoFilter"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getDistrictRevCircle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"geoFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geoFilter"}}}]}]}}]} as unknown as DocumentNode<GetDistrictRevCircleQuery, GetDistrictRevCircleQueryVariables>;
export const RevenueCircleMapDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"revenueCircleMapData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"indcFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IndicatorFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dataFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DataFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"geoFilter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GeoFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revCircleMapData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"indcFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"indcFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"dataFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dataFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"geoFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geoFilter"}}}]}]}}]} as unknown as DocumentNode<RevenueCircleMapDataQuery, RevenueCircleMapDataQueryVariables>;
export const DistrictMapDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"districtMapData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"indcFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IndicatorFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dataFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DataFilter"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"geoFilter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GeoFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"districtMapData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"indcFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"indcFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"dataFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dataFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"geoFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geoFilter"}}}]}]}}]} as unknown as DocumentNode<DistrictMapDataQuery, DistrictMapDataQueryVariables>;
export const TableDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"tableData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"indcFilter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"IndicatorFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dataFilter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DataFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"geoFilter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GeoFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tableData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"indcFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"indcFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"dataFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dataFilter"}}},{"kind":"Argument","name":{"kind":"Name","value":"geoFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"geoFilter"}}}]}]}}]} as unknown as DocumentNode<TableDataQuery, TableDataQueryVariables>;
export const GetStatesListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getStatesList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getStates"}}]}}]} as unknown as DocumentNode<GetStatesListQuery, GetStatesListQueryVariables>;