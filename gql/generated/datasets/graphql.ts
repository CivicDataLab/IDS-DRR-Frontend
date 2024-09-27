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
  /** Date with time (isoformat) */
  DateTime: any;
  /** The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID. */
  GlobalID: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  UUID: any;
  Upload: any;
};

export type AccessModelInput = {
  dataset: Scalars['UUID'];
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  resources: Array<AccessModelResourceInput>;
  type: AccessTypes;
};

export type AccessModelResourceInput = {
  fields: Array<Scalars['Int']>;
  resource: Scalars['UUID'];
};

export enum AccessTypes {
  Private = 'PRIVATE',
  Protected = 'PROTECTED',
  Public = 'PUBLIC'
}

export type AddDatasetPayload = OperationInfo | TypeDataset;

export type AddUpdateDatasetMetadataPayload = OperationInfo | TypeDataset;

export enum AggregateType {
  Average = 'AVERAGE',
  Count = 'COUNT',
  None = 'NONE',
  Sum = 'SUM'
}

/** access model | type */
export enum ApiAccessModelTypeEnum {
  /** Private */
  Private = 'PRIVATE',
  /** Protected */
  Protected = 'PROTECTED',
  /** Public */
  Public = 'PUBLIC'
}

/** dataset | status */
export enum ApiDatasetStatusEnum {
  /** Archived */
  Archived = 'ARCHIVED',
  /** Draft */
  Draft = 'DRAFT',
  /** Published */
  Published = 'PUBLISHED'
}

/** metadata | data standard */
export enum ApiMetadataDataStandardEnum {
  /** Dcatv3 */
  Dcatv3 = 'DCATV3',
  /** Na */
  Na = 'NA',
  /** Obds */
  Obds = 'OBDS',
  /** Ocds */
  Ocds = 'OCDS'
}

/** metadata | data type */
export enum ApiMetadataDataTypeEnum {
  /** Date */
  Date = 'DATE',
  /** Multiselect */
  Multiselect = 'MULTISELECT',
  /** Number */
  Number = 'NUMBER',
  /** Select */
  Select = 'SELECT',
  /** String */
  String = 'STRING'
}

/** metadata | model */
export enum ApiMetadataModelEnum {
  /** Dataset */
  Dataset = 'DATASET',
  /** Reseource */
  Resource = 'RESOURCE'
}

/** metadata | type */
export enum ApiMetadataTypeEnum {
  /** Advanced */
  Advanced = 'ADVANCED',
  /** Optional */
  Optional = 'OPTIONAL',
  /** Required */
  Required = 'REQUIRED'
}

/** organization | organization types */
export enum ApiOrganizationOrganizationTypesEnum {
  /** Academic Institution */
  AcademicInstitution = 'ACADEMIC_INSTITUTION',
  /** Central Government */
  CentralGovernment = 'CENTRAL_GOVERNMENT',
  /** Citizens Group */
  CitizensGroup = 'CITIZENS_GROUP',
  /** Civil Society Organisation */
  CivilSocietyOrganisation = 'CIVIL_SOCIETY_ORGANISATION',
  /** Corporations */
  Corporations = 'CORPORATIONS',
  /** Government */
  Government = 'GOVERNMENT',
  /** Industry Body */
  IndustryBody = 'INDUSTRY_BODY',
  /** Media Organisation */
  MediaOrganisation = 'MEDIA_ORGANISATION',
  /** Ngo */
  Ngo = 'NGO',
  /** Open Data Technology Community */
  OpenDataTechnologyCommunity = 'OPEN_DATA_TECHNOLOGY_COMMUNITY',
  /** Others */
  Others = 'OTHERS',
  /** Private Company */
  PrivateCompany = 'PRIVATE_COMPANY',
  /** Public Sector Company */
  PublicSectorCompany = 'PUBLIC_SECTOR_COMPANY',
  /** Startup */
  Startup = 'STARTUP',
  /** State Government */
  StateGovernment = 'STATE_GOVERNMENT',
  /** Union Territory Government */
  UnionTerritoryGovernment = 'UNION_TERRITORY_GOVERNMENT',
  /** Urban Local Body */
  UrbanLocalBody = 'URBAN_LOCAL_BODY'
}

/** resource chart details | aggregate type */
export enum ApiResourceChartDetailsAggregateTypeEnum {
  /** Average */
  Average = 'AVERAGE',
  /** Count */
  Count = 'COUNT',
  /** None */
  None = 'NONE',
  /** Sum */
  Sum = 'SUM'
}

/** resource chart details | chart type */
export enum ApiResourceChartDetailsChartTypeEnum {
  /** Assam District */
  AssamDistrict = 'ASSAM_DISTRICT',
  /** Assam Rc */
  AssamRc = 'ASSAM_RC',
  /** Bar Horizontal */
  BarHorizontal = 'BAR_HORIZONTAL',
  /** Bar Vertical */
  BarVertical = 'BAR_VERTICAL',
  /** Line */
  Line = 'LINE'
}

/** resource schema | format */
export enum ApiResourceSchemaFormatEnum {
  /** Date */
  Date = 'DATE',
  /** Integer */
  Integer = 'INTEGER',
  /** Number */
  Number = 'NUMBER',
  /** String */
  String = 'STRING'
}

/** resource | type */
export enum ApiResourceTypeEnum {
  /** Api */
  Api = 'API',
  /** External */
  External = 'EXTERNAL',
  /** File */
  File = 'FILE'
}

/** Category(id, name, description, parent_id, slug) */
export type CategoryFilter = {
  AND?: InputMaybe<CategoryFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']>;
  NOT?: InputMaybe<CategoryFilter>;
  OR?: InputMaybe<CategoryFilter>;
  id?: InputMaybe<Scalars['UUID']>;
  slug?: InputMaybe<Scalars['String']>;
};

/** Category(id, name, description, parent_id, slug) */
export type CategoryInput = {
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['UUID']>;
  name: Scalars['String'];
  parentId?: InputMaybe<Scalars['UUID']>;
  slug?: InputMaybe<Scalars['String']>;
};

/** Category(id, name, description, parent_id, slug) */
export type CategoryInputPartial = {
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['UUID']>;
  name?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['UUID']>;
  slug?: InputMaybe<Scalars['String']>;
};

export enum ChartTypes {
  AssamDistrict = 'ASSAM_DISTRICT',
  AssamRc = 'ASSAM_RC',
  BarHorizontal = 'BAR_HORIZONTAL',
  BarVertical = 'BAR_VERTICAL',
  Line = 'LINE'
}

export type CreateAccessModelPayload = OperationInfo | TypeAccessModel;

export type CreateEmptyFileResourceInput = {
  dataset: Scalars['UUID'];
};

export type CreateFileResourceInput = {
  dataset: Scalars['UUID'];
  files: Array<Scalars['Upload']>;
};

export type CreateFileResourcePayload = OperationInfo | TypeResource;

export type DsMetadataItemType = {
  id: Scalars['String'];
  value: Scalars['String'];
};

/** Dataset(id, title, description, organization, created, modified, status) */
export type DatasetFilter = {
  AND?: InputMaybe<DatasetFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']>;
  NOT?: InputMaybe<DatasetFilter>;
  OR?: InputMaybe<DatasetFilter>;
  id: Scalars['UUID'];
};

export type DjangoFileType = {
  __typename?: 'DjangoFileType';
  name: Scalars['String'];
  path: Scalars['String'];
  size: Scalars['Int'];
  url: Scalars['String'];
};

export type DjangoImageType = {
  __typename?: 'DjangoImageType';
  height: Scalars['Int'];
  name: Scalars['String'];
  path: Scalars['String'];
  size: Scalars['Int'];
  url: Scalars['String'];
  width: Scalars['Int'];
};

export type DjangoModelType = {
  __typename?: 'DjangoModelType';
  pk: Scalars['ID'];
};

export type EditAccessModelInput = {
  accessModelId?: InputMaybe<Scalars['UUID']>;
  dataset: Scalars['UUID'];
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  resources?: InputMaybe<Array<AccessModelResourceInput>>;
  type?: InputMaybe<AccessTypes>;
};

export type EditAccessModelPayload = OperationInfo | TypeAccessModel;

export type EditResourceChartPayload = OperationInfo | TypeResourceChart;

export enum FieldType {
  Date = 'DATE',
  Integer = 'INTEGER',
  Number = 'NUMBER',
  String = 'STRING'
}

/** Metadata(id, label, data_standard, urn, data_type, options, validator, type, model, enabled, filterable) */
export type MetadataFilter = {
  AND?: InputMaybe<MetadataFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']>;
  NOT?: InputMaybe<MetadataFilter>;
  OR?: InputMaybe<MetadataFilter>;
  enabled: Scalars['Boolean'];
  model: Scalars['String'];
};

/** Metadata(id, label, data_standard, urn, data_type, options, validator, type, model, enabled, filterable) */
export type MetadataInput = {
  dataStandard?: InputMaybe<ApiMetadataDataStandardEnum>;
  dataType: ApiMetadataDataTypeEnum;
  enabled?: InputMaybe<Scalars['Boolean']>;
  filterable?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  label: Scalars['String'];
  model: ApiMetadataModelEnum;
  options?: InputMaybe<Scalars['String']>;
  type: ApiMetadataTypeEnum;
  urn?: InputMaybe<Scalars['String']>;
  validator?: InputMaybe<Scalars['String']>;
};

/** Metadata(id, label, data_standard, urn, data_type, options, validator, type, model, enabled, filterable) */
export type MetadataInputPartial = {
  dataStandard?: InputMaybe<ApiMetadataDataStandardEnum>;
  dataType?: InputMaybe<ApiMetadataDataTypeEnum>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  filterable?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  label?: InputMaybe<Scalars['String']>;
  model?: InputMaybe<ApiMetadataModelEnum>;
  options?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<ApiMetadataTypeEnum>;
  urn?: InputMaybe<Scalars['String']>;
  validator?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addDataset: AddDatasetPayload;
  addUpdateDatasetMetadata: AddUpdateDatasetMetadataPayload;
  createAccessModel: CreateAccessModelPayload;
  createCategory: TypeCategory;
  createFileResource: CreateFileResourcePayload;
  createFileResources: Array<TypeResource>;
  createMetadata: TypeMetadata;
  createOrganization: TypeOrganization;
  deleteAccessModel: Scalars['Boolean'];
  deleteCategory: TypeCategory;
  deleteDataset: Scalars['Boolean'];
  deleteFileResource: Scalars['Boolean'];
  deleteMetadata: Scalars['Boolean'];
  deleteOrganization: TypeOrganization;
  deleteResourceChart: Scalars['Boolean'];
  editAccessModel: EditAccessModelPayload;
  editResourceChart: EditResourceChartPayload;
  publishDataset: PublishDatasetPayload;
  resetFileResourceSchema: ResetFileResourceSchemaPayload;
  updateCategory: TypeCategory;
  updateDataset: UpdateDatasetPayload;
  updateFileResource: UpdateFileResourcePayload;
  updateMetadata: TypeMetadata;
  updateOrganization: TypeOrganization;
  updateSchema: UpdateSchemaPayload;
};


export type MutationAddUpdateDatasetMetadataArgs = {
  updateMetadataInput: UpdateMetadataInput;
};


export type MutationCreateAccessModelArgs = {
  accessModelInput: AccessModelInput;
};


export type MutationCreateCategoryArgs = {
  data: CategoryInput;
};


export type MutationCreateFileResourceArgs = {
  fileResourceInput: CreateEmptyFileResourceInput;
};


export type MutationCreateFileResourcesArgs = {
  fileResourceInput: CreateFileResourceInput;
};


export type MutationCreateMetadataArgs = {
  data: MetadataInput;
};


export type MutationCreateOrganizationArgs = {
  data: OrganizationInput;
};


export type MutationDeleteAccessModelArgs = {
  accessModelId: Scalars['UUID'];
};


export type MutationDeleteCategoryArgs = {
  data: NodeInput;
};


export type MutationDeleteDatasetArgs = {
  datasetId: Scalars['UUID'];
};


export type MutationDeleteFileResourceArgs = {
  resourceId: Scalars['UUID'];
};


export type MutationDeleteMetadataArgs = {
  metadataId: Scalars['String'];
};


export type MutationDeleteOrganizationArgs = {
  data: NodeInput;
};


export type MutationDeleteResourceChartArgs = {
  chartId: Scalars['UUID'];
};


export type MutationEditAccessModelArgs = {
  accessModelInput: EditAccessModelInput;
};


export type MutationEditResourceChartArgs = {
  chartInput: ResourceChartInput;
};


export type MutationPublishDatasetArgs = {
  datasetId: Scalars['UUID'];
};


export type MutationResetFileResourceSchemaArgs = {
  resourceId: Scalars['UUID'];
};


export type MutationUpdateCategoryArgs = {
  data: CategoryInputPartial;
};


export type MutationUpdateDatasetArgs = {
  updateDatasetInput: UpdateDatasetInput;
};


export type MutationUpdateFileResourceArgs = {
  fileResourceInput: UpdateFileResourceInput;
};


export type MutationUpdateMetadataArgs = {
  data: MetadataInputPartial;
};


export type MutationUpdateOrganizationArgs = {
  data: OrganizationInputPartial;
};


export type MutationUpdateSchemaArgs = {
  input: SchemaUpdateInput;
};

/** Input of an object that implements the `Node` interface. */
export type NodeInput = {
  id: Scalars['GlobalID'];
};

export type OffsetPaginationInput = {
  limit?: Scalars['Int'];
  offset?: Scalars['Int'];
};

export type OneToManyInput = {
  set?: InputMaybe<Scalars['ID']>;
};

export type OperationInfo = {
  __typename?: 'OperationInfo';
  /** List of messages returned by the operation. */
  messages: Array<OperationMessage>;
};

export type OperationMessage = {
  __typename?: 'OperationMessage';
  /** The error code, or `null` if no error code was set. */
  code?: Maybe<Scalars['String']>;
  /** The field that caused the error, or `null` if it isn't associated with any particular field. */
  field?: Maybe<Scalars['String']>;
  /** The kind of this message. */
  kind: OperationMessageKind;
  /** The error message. */
  message: Scalars['String'];
};

export enum OperationMessageKind {
  Error = 'ERROR',
  Info = 'INFO',
  Permission = 'PERMISSION',
  Validation = 'VALIDATION',
  Warning = 'WARNING'
}

/** Organization(id, name, description, logo, created, modified, homepage, contact_email, organization_types, parent, slug) */
export type OrganizationInput = {
  contactEmail?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['DateTime']>;
  description: Scalars['String'];
  homepage?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  logo?: InputMaybe<Scalars['Upload']>;
  modified?: InputMaybe<Scalars['DateTime']>;
  name: Scalars['String'];
  organizationTypes: ApiOrganizationOrganizationTypesEnum;
  parent?: InputMaybe<OneToManyInput>;
  slug?: InputMaybe<Scalars['String']>;
};

/** Organization(id, name, description, logo, created, modified, homepage, contact_email, organization_types, parent, slug) */
export type OrganizationInputPartial = {
  contactEmail?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  homepage?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  logo?: InputMaybe<Scalars['Upload']>;
  modified?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  organizationTypes?: InputMaybe<ApiOrganizationOrganizationTypesEnum>;
  parent?: InputMaybe<OneToManyInput>;
  slug?: InputMaybe<Scalars['String']>;
};

export type PreviewDetails = {
  endEntry?: InputMaybe<Scalars['Int']>;
  isAllEntries?: InputMaybe<Scalars['Boolean']>;
  startEntry?: InputMaybe<Scalars['Int']>;
};

export type PublishDatasetPayload = OperationInfo | TypeDataset;

export type Query = {
  __typename?: 'Query';
  accessModel: TypeAccessModel;
  accessModelResources: Array<TypeAccessModel>;
  categories: Array<TypeCategory>;
  chartsDetails: Array<TypeResourceChart>;
  datasetResources: Array<TypeResource>;
  datasets: Array<TypeDataset>;
  metadata: Array<TypeMetadata>;
  resource: Array<TypeResource>;
  resourceChart: TypeResourceChart;
  tags: Array<TypeTag>;
};


export type QueryAccessModelArgs = {
  accessModelId: Scalars['UUID'];
};


export type QueryAccessModelResourcesArgs = {
  datasetId: Scalars['UUID'];
};


export type QueryCategoriesArgs = {
  filters?: InputMaybe<CategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryChartsDetailsArgs = {
  datasetId: Scalars['UUID'];
};


export type QueryDatasetResourcesArgs = {
  datasetId: Scalars['UUID'];
};


export type QueryDatasetsArgs = {
  filters?: InputMaybe<DatasetFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryMetadataArgs = {
  filters?: InputMaybe<MetadataFilter>;
};


export type QueryResourceChartArgs = {
  chartDetailsId: Scalars['UUID'];
};

export type ResetFileResourceSchemaPayload = OperationInfo | TypeResource;

/** ResourceChartDetails(id, resource, name, description, chart_type, x_axis_label, y_axis_label, x_axis_column, y_axis_column, show_legend, aggregate_type, region_column, value_column) */
export type ResourceChartInput = {
  aggregateType?: AggregateType;
  chartId?: InputMaybe<Scalars['UUID']>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  regionColumn?: InputMaybe<Scalars['String']>;
  resource: Scalars['UUID'];
  showLegend?: InputMaybe<Scalars['Boolean']>;
  type: ChartTypes;
  valueColumn?: InputMaybe<Scalars['String']>;
  xAxisColumn?: InputMaybe<Scalars['String']>;
  xAxisLabel?: InputMaybe<Scalars['String']>;
  yAxisColumn?: InputMaybe<Scalars['String']>;
  yAxisLabel?: InputMaybe<Scalars['String']>;
};

export type SchemaUpdate = {
  description: Scalars['String'];
  format: FieldType;
  id: Scalars['String'];
};

export type SchemaUpdateInput = {
  resource: Scalars['UUID'];
  updates: Array<SchemaUpdate>;
};

/** AccessModel(id, name, description, dataset, type, organization, created, modified) */
export type TypeAccessModel = {
  __typename?: 'TypeAccessModel';
  created: Scalars['DateTime'];
  dataset: DjangoModelType;
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  modelResources: Array<TypeAccessModelResource>;
  modified: Scalars['DateTime'];
  name?: Maybe<Scalars['String']>;
  organization?: Maybe<DjangoModelType>;
  type: ApiAccessModelTypeEnum;
};

/** AccessModelResource(id, access_model, resource) */
export type TypeAccessModelResource = {
  __typename?: 'TypeAccessModelResource';
  accessModel: DjangoModelType;
  fields: Array<TypeResourceSchema>;
  id: Scalars['ID'];
  resource: TypeResource;
};

/** AccessModelResource(id, access_model, resource) */
export type TypeAccessModelResourceFields = {
  __typename?: 'TypeAccessModelResourceFields';
  fields: Array<TypeResourceSchema>;
};

/** Category(id, name, description, parent_id, slug) */
export type TypeCategory = {
  __typename?: 'TypeCategory';
  datasetCount: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  name: Scalars['String'];
  parentId?: Maybe<TypeCategory>;
  slug?: Maybe<Scalars['String']>;
};

/** Dataset(id, title, description, organization, created, modified, status) */
export type TypeDataset = {
  __typename?: 'TypeDataset';
  accessModels: Array<TypeAccessModel>;
  categories: Array<TypeCategory>;
  created: Scalars['DateTime'];
  description: Scalars['String'];
  formats: Array<Scalars['String']>;
  id: Scalars['UUID'];
  metadata: Array<TypeDatasetMetadata>;
  modified: Scalars['DateTime'];
  organization?: Maybe<DjangoModelType>;
  resources: Array<TypeResource>;
  status: ApiDatasetStatusEnum;
  tags: Array<TypeTag>;
  title: Scalars['String'];
};


/** Dataset(id, title, description, organization, created, modified, status) */
export type TypeDatasetCategoriesArgs = {
  filters?: InputMaybe<CategoryFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

/** DatasetMetadata(id, dataset, metadata_item, value) */
export type TypeDatasetMetadata = {
  __typename?: 'TypeDatasetMetadata';
  dataset: DjangoModelType;
  id: Scalars['ID'];
  metadataItem: TypeMetadata;
  value: Scalars['String'];
};

/** ResourceFileDetails(id, resource, file, size, created, modified, format) */
export type TypeFileDetails = {
  __typename?: 'TypeFileDetails';
  created: Scalars['DateTime'];
  file: DjangoFileType;
  format: Scalars['String'];
  id: Scalars['ID'];
  modified: Scalars['DateTime'];
  resource: DjangoModelType;
  size?: Maybe<Scalars['Float']>;
};

/** Metadata(id, label, data_standard, urn, data_type, options, validator, type, model, enabled, filterable) */
export type TypeMetadata = {
  __typename?: 'TypeMetadata';
  dataStandard: ApiMetadataDataStandardEnum;
  dataType: ApiMetadataDataTypeEnum;
  enabled: Scalars['Boolean'];
  filterable: Scalars['Boolean'];
  id: Scalars['ID'];
  label: Scalars['String'];
  model: ApiMetadataModelEnum;
  options: Scalars['String'];
  type: ApiMetadataTypeEnum;
  urn: Scalars['String'];
  validator: Scalars['String'];
};

/** Organization(id, name, description, logo, created, modified, homepage, contact_email, organization_types, parent, slug) */
export type TypeOrganization = {
  __typename?: 'TypeOrganization';
  contactEmail?: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  datasetCount: Scalars['Int'];
  description: Scalars['String'];
  homepage: Scalars['String'];
  id: Scalars['ID'];
  logo?: Maybe<DjangoImageType>;
  modified: Scalars['DateTime'];
  name: Scalars['String'];
  organizationTypes: ApiOrganizationOrganizationTypesEnum;
  parent?: Maybe<DjangoModelType>;
  parentId?: Maybe<TypeOrganization>;
  slug?: Maybe<Scalars['String']>;
};

/** Resource(id, dataset, created, modified, type, name, description, preview_enabled, preview_details) */
export type TypeResource = {
  __typename?: 'TypeResource';
  accessModels: Array<TypeResourceAccessModel>;
  created: Scalars['DateTime'];
  dataset?: Maybe<DjangoModelType>;
  description: Scalars['String'];
  fileDetails?: Maybe<TypeFileDetails>;
  id: Scalars['UUID'];
  metadata: Array<TypeResourceMetadata>;
  modified: Scalars['DateTime'];
  name: Scalars['String'];
  previewDetails?: Maybe<DjangoModelType>;
  previewEnabled: Scalars['Boolean'];
  schema?: Maybe<Array<TypeResourceSchema>>;
  type: ApiResourceTypeEnum;
};

/** AccessModel(id, name, description, dataset, type, organization, created, modified) */
export type TypeResourceAccessModel = {
  __typename?: 'TypeResourceAccessModel';
  created: Scalars['DateTime'];
  dataset: DjangoModelType;
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  modelResources: Array<TypeAccessModelResourceFields>;
  modified: Scalars['DateTime'];
  name?: Maybe<Scalars['String']>;
  organization?: Maybe<DjangoModelType>;
  type: ApiAccessModelTypeEnum;
};

/** ResourceChartDetails(id, resource, name, description, chart_type, x_axis_label, y_axis_label, x_axis_column, y_axis_column, show_legend, aggregate_type, region_column, value_column) */
export type TypeResourceChart = {
  __typename?: 'TypeResourceChart';
  aggregateType: ApiResourceChartDetailsAggregateTypeEnum;
  chart: Scalars['JSON'];
  chartType: ApiResourceChartDetailsChartTypeEnum;
  description: Scalars['String'];
  id: Scalars['UUID'];
  name: Scalars['String'];
  regionColumn?: Maybe<TypeResourceSchema>;
  resource: TypeResource;
  showLegend: Scalars['Boolean'];
  valueColumn?: Maybe<TypeResourceSchema>;
  xAxisColumn?: Maybe<TypeResourceSchema>;
  xAxisLabel: Scalars['String'];
  yAxisColumn?: Maybe<TypeResourceSchema>;
  yAxisLabel: Scalars['String'];
};

/** ResourceMetadata(id, resource, metadata_item, value) */
export type TypeResourceMetadata = {
  __typename?: 'TypeResourceMetadata';
  id: Scalars['ID'];
  metadataItem: TypeMetadata;
  resource: DjangoModelType;
  value: Scalars['String'];
};

/** ResourceSchema(id, resource, field_name, format, description) */
export type TypeResourceSchema = {
  __typename?: 'TypeResourceSchema';
  description?: Maybe<Scalars['String']>;
  fieldName: Scalars['String'];
  format: ApiResourceSchemaFormatEnum;
  id: Scalars['ID'];
  resource: DjangoModelType;
};

/** Tag(id, value) */
export type TypeTag = {
  __typename?: 'TypeTag';
  id: Scalars['ID'];
  value: Scalars['String'];
};

export type UpdateDatasetInput = {
  dataset: Scalars['UUID'];
  description?: InputMaybe<Scalars['String']>;
  tags: Array<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateDatasetPayload = OperationInfo | TypeDataset;

export type UpdateFileResourceInput = {
  description?: InputMaybe<Scalars['String']>;
  file?: InputMaybe<Scalars['Upload']>;
  id: Scalars['UUID'];
  name?: InputMaybe<Scalars['String']>;
  previewDetails?: InputMaybe<PreviewDetails>;
  previewEnabled?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateFileResourcePayload = OperationInfo | TypeResource;

export type UpdateMetadataInput = {
  categories: Array<Scalars['UUID']>;
  dataset: Scalars['UUID'];
  description?: InputMaybe<Scalars['String']>;
  metadata: Array<DsMetadataItemType>;
  tags?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateSchemaPayload = OperationInfo | TypeResource;

export type DatasetsQueryVariables = Exact<{
  filters?: InputMaybe<DatasetFilter>;
}>;


export type DatasetsQuery = { __typename?: 'Query', datasets: Array<{ __typename?: 'TypeDataset', id: any, title: string, description: string, created: any, modified: any, formats: Array<string>, tags: Array<{ __typename?: 'TypeTag', id: string, value: string }>, metadata: Array<{ __typename?: 'TypeDatasetMetadata', value: string, metadataItem: { __typename?: 'TypeMetadata', id: string, label: string } }>, resources: Array<{ __typename?: 'TypeResource', id: any, created: any, modified: any, type: ApiResourceTypeEnum, name: string, description: string }>, categories: Array<{ __typename?: 'TypeCategory', name: string }> }> };

export type ChartsDataQueryVariables = Exact<{
  datasetId: Scalars['UUID'];
}>;


export type ChartsDataQuery = { __typename?: 'Query', chartsDetails: Array<{ __typename?: 'TypeResourceChart', aggregateType: ApiResourceChartDetailsAggregateTypeEnum, chartType: ApiResourceChartDetailsChartTypeEnum, description: string, id: any, name: string, showLegend: boolean, xAxisLabel: string, yAxisLabel: string, chart: any }> };

export type DatasetResourcesQueryVariables = Exact<{
  datasetId: Scalars['UUID'];
}>;


export type DatasetResourcesQuery = { __typename?: 'Query', datasetResources: Array<{ __typename?: 'TypeResource', id: any, created: any, modified: any, type: ApiResourceTypeEnum, name: string, description: string, accessModels: Array<{ __typename?: 'TypeResourceAccessModel', name?: string | null, description?: string | null, type: ApiAccessModelTypeEnum, modelResources: Array<{ __typename?: 'TypeAccessModelResourceFields', fields: Array<{ __typename?: 'TypeResourceSchema', format: ApiResourceSchemaFormatEnum, fieldName: string, description?: string | null }> }> }>, schema?: Array<{ __typename?: 'TypeResourceSchema', fieldName: string, id: string, format: ApiResourceSchemaFormatEnum, description?: string | null }> | null, fileDetails?: { __typename?: 'TypeFileDetails', format: string } | null }> };


export const DatasetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"datasets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DatasetFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"datasets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadataItem"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"formats"}}]}}]}}]} as unknown as DocumentNode<DatasetsQuery, DatasetsQueryVariables>;
export const ChartsDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"chartsData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"datasetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chartsDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"datasetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"datasetId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aggregateType"}},{"kind":"Field","name":{"kind":"Name","value":"chartType"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"showLegend"}},{"kind":"Field","name":{"kind":"Name","value":"xAxisLabel"}},{"kind":"Field","name":{"kind":"Name","value":"yAxisLabel"}},{"kind":"Field","name":{"kind":"Name","value":"chart"}}]}}]}}]} as unknown as DocumentNode<ChartsDataQuery, ChartsDataQueryVariables>;
export const DatasetResourcesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"datasetResources"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"datasetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"datasetResources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"datasetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"datasetId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"accessModels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"modelResources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"fieldName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"schema"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fieldName"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fileDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"format"}}]}}]}}]}}]} as unknown as DocumentNode<DatasetResourcesQuery, DatasetResourcesQueryVariables>;