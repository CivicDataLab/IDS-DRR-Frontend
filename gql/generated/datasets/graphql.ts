/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
/** access model | type */
export type ApiAccessModelTypeEnum =
  /** Private */
  | 'PRIVATE'
  /** Protected */
  | 'PROTECTED'
  /** Public */
  | 'PUBLIC';

/** resource schema | format */
export type ApiResourceSchemaFormatEnum =
  /** Boolean */
  | 'BOOLEAN'
  /** Date */
  | 'DATE'
  /** Integer */
  | 'INTEGER'
  /** Number */
  | 'NUMBER'
  /** String */
  | 'STRING';

/** resource | type */
export type ApiResourceTypeEnum =
  /** Api */
  | 'API'
  /** External */
  | 'EXTERNAL'
  /** File */
  | 'FILE';

/** Dataset(id, title, description, organization, dataspace, created, modified, status) */
export type DatasetFilter = {
  AND?: DatasetFilter | null | undefined;
  DISTINCT?: boolean | null | undefined;
  NOT?: DatasetFilter | null | undefined;
  OR?: DatasetFilter | null | undefined;
  id?: any;
  status?: DatasetStatus | null | undefined;
};

export type DatasetStatus =
  | 'ARCHIVED'
  | 'DRAFT'
  | 'PUBLISHED';

export type DatasetsQueryVariables = Exact<{
  filters?: DatasetFilter | null | undefined;
}>;


export type DatasetsQuery = { datasets: Array<{ id: any, title: string, description: string, created: any, modified: any, formats: Array<string>, tags: Array<{ id: string, value: string }>, metadata: Array<{ value: string, metadataItem: { id: string, label: string } }>, resources: Array<{ id: any, created: any, modified: any, type: ApiResourceTypeEnum, name: string, description: string }>, categories: Array<{ name: string }> }> };

export type ChartsDataQueryVariables = Exact<{
  datasetId: any;
}>;


export type ChartsDataQuery = { chartsDetails: Array<{ chartType: string, description: string, id: any, name: string, chart: any, options: { aggregateType: string | null, showLegend: boolean | null, xAxisLabel: string | null, yAxisLabel: string | null, xAxisColumn: { id: string, fieldName: string } | null, yAxisColumn: Array<{ field: { id: string, fieldName: string } | null }> | null, regionColumn: { id: string, fieldName: string } | null, valueColumn: { id: string, fieldName: string } | null } | null }> };

export type DatasetResourcesQueryVariables = Exact<{
  datasetId: any;
}>;


export type DatasetResourcesQuery = { datasetResources: Array<{ id: any, created: any, modified: any, type: ApiResourceTypeEnum, name: string, description: string, accessModels: Array<{ name: string | null, description: string | null, type: ApiAccessModelTypeEnum, modelResources: Array<{ fields: Array<{ format: ApiResourceSchemaFormatEnum, fieldName: string, description: string | null }> }> }>, schema: Array<{ fieldName: string, id: string, format: ApiResourceSchemaFormatEnum, description: string | null }> | null, fileDetails: { format: string } | null }> };


export const DatasetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"datasets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"datasets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadataItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}}]}}]} as unknown as DocumentNode<DatasetsQuery, DatasetsQueryVariables>;
export const ChartsDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"chartsData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"datasetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chartsDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"datasetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"datasetId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chartType"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregateType"}},{"kind":"Field","name":{"kind":"Name","value":"xAxisColumn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fieldName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"yAxisColumn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fieldName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"showLegend"}},{"kind":"Field","name":{"kind":"Name","value":"xAxisLabel"}},{"kind":"Field","name":{"kind":"Name","value":"yAxisLabel"}},{"kind":"Field","name":{"kind":"Name","value":"regionColumn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fieldName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"valueColumn"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fieldName"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"chart"}}]}}]}}]} as unknown as DocumentNode<ChartsDataQuery, ChartsDataQueryVariables>;
export const DatasetResourcesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"datasetResources"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"datasetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"datasetResources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"datasetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"datasetId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"accessModels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"modelResources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"fieldName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fileDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"format"}}]}}]}}]}}]} as unknown as DocumentNode<DatasetResourcesQuery, DatasetResourcesQueryVariables>;