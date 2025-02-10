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

export type AddDatasetToUseCasePayload = OperationInfo | TypeUseCase;

export type AddResourceChartImagePayload = OperationInfo | TypeResourceChartImage;

export type AddResourceChartPayload = OperationInfo | TypeResourceChart;

export type AddUpdateDatasetMetadataPayload = OperationInfo | TypeDataset;

export type AddUseCasePayload = OperationInfo | TypeUseCase;

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
  String = 'STRING',
  /** Url */
  Url = 'URL'
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
  /** Count */
  Count = 'COUNT',
  /** Average */
  Mean = 'MEAN',
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
  /** Grouped Bar Horizontal */
  GroupedBarHorizontal = 'GROUPED_BAR_HORIZONTAL',
  /** Grouped Bar Vertical */
  GroupedBarVertical = 'GROUPED_BAR_VERTICAL',
  /** Line */
  Line = 'LINE'
}

/** resource schema | format */
export enum ApiResourceSchemaFormatEnum {
  /** Boolean */
  Boolean = 'BOOLEAN',
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

/** use case | status */
export enum ApiUseCaseStatusEnum {
  /** Archived */
  Archived = 'ARCHIVED',
  /** Draft */
  Draft = 'DRAFT',
  /** Published */
  Published = 'PUBLISHED'
}

export type ArchiveUseCasePayload = OperationInfo | TypeUseCase;

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
  GroupedBarHorizontal = 'GROUPED_BAR_HORIZONTAL',
  GroupedBarVertical = 'GROUPED_BAR_VERTICAL',
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

/** DataSpace(id, name, description, logo, created, modified, homepage, contact_email, slug) */
export type DataSpaceFilter = {
  AND?: InputMaybe<DataSpaceFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']>;
  NOT?: InputMaybe<DataSpaceFilter>;
  OR?: InputMaybe<DataSpaceFilter>;
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};

/** DataSpace(id, name, description, logo, created, modified, homepage, contact_email, slug) */
export type DataSpaceInput = {
  contactEmail?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['DateTime']>;
  description: Scalars['String'];
  homepage?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  logo?: InputMaybe<Scalars['Upload']>;
  modified?: InputMaybe<Scalars['DateTime']>;
  name: Scalars['String'];
  slug?: InputMaybe<Scalars['String']>;
};

/** DataSpace(id, name, description, logo, created, modified, homepage, contact_email, slug) */
export type DataSpaceInputPartial = {
  contactEmail?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  homepage?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  logo?: InputMaybe<Scalars['Upload']>;
  modified?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  slug?: InputMaybe<Scalars['String']>;
};

/** Dataset(id, title, description, organization, dataspace, created, modified, status) */
export type DatasetFilter = {
  AND?: InputMaybe<DatasetFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']>;
  NOT?: InputMaybe<DatasetFilter>;
  OR?: InputMaybe<DatasetFilter>;
  id?: InputMaybe<Scalars['UUID']>;
  status?: InputMaybe<DatasetStatus>;
};

export type DatasetOrder = {
  created?: InputMaybe<Ordering>;
  modified?: InputMaybe<Ordering>;
  title?: InputMaybe<Ordering>;
};

export enum DatasetStatus {
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

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

export type FilterInput = {
  column: Scalars['String'];
  operator: Scalars['String'];
  value: Scalars['String'];
};

/** Metadata(id, label, data_standard, urn, data_type, options, validator, validator_options, type, model, enabled, filterable) */
export type MetadataFilter = {
  AND?: InputMaybe<MetadataFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']>;
  NOT?: InputMaybe<MetadataFilter>;
  OR?: InputMaybe<MetadataFilter>;
  enabled: Scalars['Boolean'];
  model: Scalars['String'];
};

/** Metadata(id, label, data_standard, urn, data_type, options, validator, validator_options, type, model, enabled, filterable) */
export type MetadataInput = {
  dataStandard?: InputMaybe<ApiMetadataDataStandardEnum>;
  dataType: ApiMetadataDataTypeEnum;
  enabled?: InputMaybe<Scalars['Boolean']>;
  filterable?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  label: Scalars['String'];
  model: ApiMetadataModelEnum;
  options?: InputMaybe<Scalars['JSON']>;
  type: ApiMetadataTypeEnum;
  urn?: InputMaybe<Scalars['String']>;
  validator?: InputMaybe<Scalars['JSON']>;
  validatorOptions?: InputMaybe<Scalars['JSON']>;
};

/** Metadata(id, label, data_standard, urn, data_type, options, validator, validator_options, type, model, enabled, filterable) */
export type MetadataInputPartial = {
  dataStandard?: InputMaybe<ApiMetadataDataStandardEnum>;
  dataType?: InputMaybe<ApiMetadataDataTypeEnum>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  filterable?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['String'];
  label?: InputMaybe<Scalars['String']>;
  model?: InputMaybe<ApiMetadataModelEnum>;
  options?: InputMaybe<Scalars['JSON']>;
  type?: InputMaybe<ApiMetadataTypeEnum>;
  urn?: InputMaybe<Scalars['String']>;
  validator?: InputMaybe<Scalars['JSON']>;
  validatorOptions?: InputMaybe<Scalars['JSON']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addDataset: AddDatasetPayload;
  addDatasetToUseCase: AddDatasetToUseCasePayload;
  addResourceChart: AddResourceChartPayload;
  addResourceChartImage: AddResourceChartImagePayload;
  addUpdateDatasetMetadata: AddUpdateDatasetMetadataPayload;
  addUseCase: AddUseCasePayload;
  archiveUseCase: ArchiveUseCasePayload;
  createAccessModel: CreateAccessModelPayload;
  createCategory: TypeCategory;
  createDataspace: TypeDataSpace;
  createFileResource: CreateFileResourcePayload;
  createFileResources: Array<TypeResource>;
  createMetadata: TypeMetadata;
  createOrganization: TypeOrganization;
  createResourceChartImage: TypeResourceChartImage;
  createUseCase: TypeUseCase;
  deleteAccessModel: Scalars['Boolean'];
  deleteCategory: TypeCategory;
  deleteDataset: Scalars['Boolean'];
  deleteDataspace: TypeDataSpace;
  deleteFileResource: Scalars['Boolean'];
  deleteMetadata: Scalars['Boolean'];
  deleteOrganization: TypeOrganization;
  deleteResourceChart: Scalars['Boolean'];
  deleteResourceChartImage: Scalars['Boolean'];
  deleteUseCase: Scalars['Boolean'];
  editAccessModel: EditAccessModelPayload;
  editResourceChart: EditResourceChartPayload;
  publishDataset: PublishDatasetPayload;
  publishUseCase: PublishUseCasePayload;
  removeDatasetFromUseCase: RemoveDatasetFromUseCasePayload;
  resetFileResourceSchema: ResetFileResourceSchemaPayload;
  unPublishDataset: UnPublishDatasetPayload;
  unpublishUseCase: UnpublishUseCasePayload;
  updateCategory: TypeCategory;
  updateDataset: UpdateDatasetPayload;
  updateDataspace: TypeDataSpace;
  updateFileResource: UpdateFileResourcePayload;
  updateMetadata: TypeMetadata;
  updateOrganization: TypeOrganization;
  updateResourceChartImage: TypeResourceChartImage;
  updateSchema: UpdateSchemaPayload;
  updateUseCase: TypeUseCase;
  updateUsecaseDatasets: UpdateUsecaseDatasetsPayload;
};


export type MutationAddDatasetToUseCaseArgs = {
  datasetId: Scalars['UUID'];
  useCaseId: Scalars['Int'];
};


export type MutationAddResourceChartArgs = {
  resource: Scalars['UUID'];
};


export type MutationAddResourceChartImageArgs = {
  dataset: Scalars['UUID'];
};


export type MutationAddUpdateDatasetMetadataArgs = {
  updateMetadataInput: UpdateMetadataInput;
};


export type MutationArchiveUseCaseArgs = {
  useCaseId: Scalars['Int'];
};


export type MutationCreateAccessModelArgs = {
  accessModelInput: AccessModelInput;
};


export type MutationCreateCategoryArgs = {
  data: CategoryInput;
};


export type MutationCreateDataspaceArgs = {
  data: DataSpaceInput;
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


export type MutationCreateResourceChartImageArgs = {
  data: ResourceChartImageInput;
};


export type MutationCreateUseCaseArgs = {
  data: UseCaseInput;
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


export type MutationDeleteDataspaceArgs = {
  data: NodeInput;
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


export type MutationDeleteResourceChartImageArgs = {
  resourceChartImageId: Scalars['String'];
};


export type MutationDeleteUseCaseArgs = {
  useCaseId: Scalars['String'];
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


export type MutationPublishUseCaseArgs = {
  useCaseId: Scalars['Int'];
};


export type MutationRemoveDatasetFromUseCaseArgs = {
  datasetId: Scalars['UUID'];
  useCaseId: Scalars['Int'];
};


export type MutationResetFileResourceSchemaArgs = {
  resourceId: Scalars['UUID'];
};


export type MutationUnPublishDatasetArgs = {
  datasetId: Scalars['UUID'];
};


export type MutationUnpublishUseCaseArgs = {
  useCaseId: Scalars['Int'];
};


export type MutationUpdateCategoryArgs = {
  data: CategoryInputPartial;
};


export type MutationUpdateDatasetArgs = {
  updateDatasetInput: UpdateDatasetInput;
};


export type MutationUpdateDataspaceArgs = {
  data: DataSpaceInputPartial;
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


export type MutationUpdateResourceChartImageArgs = {
  data: ResourceChartImageInputPartial;
};


export type MutationUpdateSchemaArgs = {
  input: SchemaUpdateInput;
};


export type MutationUpdateUseCaseArgs = {
  data: UseCaseInputPartial;
};


export type MutationUpdateUsecaseDatasetsArgs = {
  datasetIds: Array<Scalars['UUID']>;
  useCaseId: Scalars['Int'];
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

export enum Ordering {
  Asc = 'ASC',
  AscNullsFirst = 'ASC_NULLS_FIRST',
  AscNullsLast = 'ASC_NULLS_LAST',
  Desc = 'DESC',
  DescNullsFirst = 'DESC_NULLS_FIRST',
  DescNullsLast = 'DESC_NULLS_LAST'
}

/** Organization(id, name, description, logo, created, modified, homepage, contact_email, organization_types, parent, slug) */
export type OrganizationFilter = {
  AND?: InputMaybe<OrganizationFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']>;
  NOT?: InputMaybe<OrganizationFilter>;
  OR?: InputMaybe<OrganizationFilter>;
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
};

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

export type PublishUseCasePayload = OperationInfo | TypeUseCase;

export type Query = {
  __typename?: 'Query';
  accessModel: TypeAccessModel;
  accessModelResources: Array<TypeAccessModel>;
  categories: Array<TypeCategory>;
  chartsDetails: Array<TypeResourceChart>;
  datasetResourceCharts: Array<TypeResourceChartImage>;
  datasetResources: Array<TypeResource>;
  datasets: Array<TypeDataset>;
  dataspaces: Array<TypeDataSpace>;
  getChartData: Array<TypeResourceChartImageTypeResourceChart>;
  metadata: Array<TypeMetadata>;
  organisations: Array<TypeOrganization>;
  resource: Array<TypeResource>;
  resourceChart: TypeResourceChart;
  resourceChartImages: Array<TypeResourceChartImage>;
  tags: Array<TypeTag>;
  useCases: Array<TypeUseCase>;
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


export type QueryDatasetResourceChartsArgs = {
  datasetId: Scalars['UUID'];
};


export type QueryDatasetResourcesArgs = {
  datasetId: Scalars['UUID'];
};


export type QueryDatasetsArgs = {
  filters?: InputMaybe<DatasetFilter>;
  order?: InputMaybe<DatasetOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryDataspacesArgs = {
  filters?: InputMaybe<DataSpaceFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryGetChartDataArgs = {
  datasetId: Scalars['UUID'];
};


export type QueryMetadataArgs = {
  filters?: InputMaybe<MetadataFilter>;
};


export type QueryOrganisationsArgs = {
  filters?: InputMaybe<OrganizationFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryResourceChartArgs = {
  chartDetailsId: Scalars['UUID'];
};


export type QueryResourceChartImagesArgs = {
  filters?: InputMaybe<ResourceChartImageFilter>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};


export type QueryUseCasesArgs = {
  filters?: InputMaybe<UseCaseFilter>;
  order?: InputMaybe<UseCaseOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type RemoveDatasetFromUseCasePayload = OperationInfo | TypeUseCase;

export type ResetFileResourceSchemaPayload = OperationInfo | TypeResource;

/** ResourceChartImage(id, name, description, image, dataset, modified) */
export type ResourceChartImageFilter = {
  AND?: InputMaybe<ResourceChartImageFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']>;
  NOT?: InputMaybe<ResourceChartImageFilter>;
  OR?: InputMaybe<ResourceChartImageFilter>;
  id?: InputMaybe<Scalars['UUID']>;
  name?: InputMaybe<Scalars['String']>;
};

/** ResourceChartImage(id, name, description, image, dataset, modified) */
export type ResourceChartImageInput = {
  dataset?: InputMaybe<OneToManyInput>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['UUID']>;
  image?: InputMaybe<Scalars['Upload']>;
  modified?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
};

/** ResourceChartImage(id, name, description, image, dataset, modified) */
export type ResourceChartImageInputPartial = {
  dataset?: InputMaybe<OneToManyInput>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  image?: InputMaybe<Scalars['Upload']>;
  modified?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
};

/** ResourceChartDetails(id, resource, name, description, chart_type, x_axis_label, y_axis_label, x_axis_column, y_axis_column, show_legend, aggregate_type, region_column, value_column, modified, filters, y_axis_column_list) */
export type ResourceChartInput = {
  aggregateType?: AggregateType;
  chartId?: InputMaybe<Scalars['UUID']>;
  description?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<Array<FilterInput>>;
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

/** DataSpace(id, name, description, logo, created, modified, homepage, contact_email, slug) */
export type TypeDataSpace = {
  __typename?: 'TypeDataSpace';
  contactEmail?: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  datasetCount: Scalars['Int'];
  description: Scalars['String'];
  homepage: Scalars['String'];
  id: Scalars['ID'];
  logo?: Maybe<DjangoImageType>;
  modified: Scalars['DateTime'];
  name: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
};

/** Dataset(id, title, description, organization, dataspace, created, modified, status) */
export type TypeDataset = {
  __typename?: 'TypeDataset';
  accessModels: Array<TypeAccessModel>;
  categories: Array<TypeCategory>;
  created: Scalars['DateTime'];
  dataspace?: Maybe<DjangoModelType>;
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


/** Dataset(id, title, description, organization, dataspace, created, modified, status) */
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

/** Metadata(id, label, data_standard, urn, data_type, options, validator, validator_options, type, model, enabled, filterable) */
export type TypeMetadata = {
  __typename?: 'TypeMetadata';
  dataStandard: ApiMetadataDataStandardEnum;
  dataType: ApiMetadataDataTypeEnum;
  enabled: Scalars['Boolean'];
  filterable: Scalars['Boolean'];
  id: Scalars['ID'];
  label: Scalars['String'];
  model: ApiMetadataModelEnum;
  options?: Maybe<Scalars['JSON']>;
  type: ApiMetadataTypeEnum;
  urn: Scalars['String'];
  validator: Array<ValidatorType>;
  validatorOptions?: Maybe<Scalars['JSON']>;
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

/** ResourceChartDetails(id, resource, name, description, chart_type, x_axis_label, y_axis_label, x_axis_column, y_axis_column, show_legend, aggregate_type, region_column, value_column, modified, filters, y_axis_column_list) */
export type TypeResourceChart = {
  __typename?: 'TypeResourceChart';
  aggregateType: ApiResourceChartDetailsAggregateTypeEnum;
  chart: Scalars['JSON'];
  chartType: ApiResourceChartDetailsChartTypeEnum;
  description: Scalars['String'];
  filters: Scalars['JSON'];
  id: Scalars['UUID'];
  modified: Scalars['DateTime'];
  name: Scalars['String'];
  regionColumn?: Maybe<TypeResourceSchema>;
  resource: TypeResource;
  showLegend: Scalars['Boolean'];
  valueColumn?: Maybe<TypeResourceSchema>;
  xAxisColumn?: Maybe<TypeResourceSchema>;
  xAxisLabel: Scalars['String'];
  yAxisColumn?: Maybe<TypeResourceSchema>;
  yAxisColumnList: Scalars['JSON'];
  yAxisLabel: Scalars['String'];
};

/** ResourceChartImage(id, name, description, image, dataset, modified) */
export type TypeResourceChartImage = {
  __typename?: 'TypeResourceChartImage';
  dataset?: Maybe<DjangoModelType>;
  description: Scalars['String'];
  id: Scalars['UUID'];
  image?: Maybe<DjangoImageType>;
  modified: Scalars['DateTime'];
  name: Scalars['String'];
};

export type TypeResourceChartImageTypeResourceChart = TypeResourceChart | TypeResourceChartImage;

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

/** UseCase(id, title, description, logo, created, modified, website, contact_email, slug, status) */
export type TypeUseCase = {
  __typename?: 'TypeUseCase';
  contactEmail?: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  datasetCount: Scalars['Int'];
  datasets?: Maybe<Array<TypeDataset>>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  logo?: Maybe<DjangoImageType>;
  modified: Scalars['DateTime'];
  slug?: Maybe<Scalars['String']>;
  status: ApiUseCaseStatusEnum;
  title?: Maybe<Scalars['String']>;
  website: Scalars['String'];
};


/** UseCase(id, title, description, logo, created, modified, website, contact_email, slug, status) */
export type TypeUseCaseDatasetsArgs = {
  filters?: InputMaybe<DatasetFilter>;
  order?: InputMaybe<DatasetOrder>;
  pagination?: InputMaybe<OffsetPaginationInput>;
};

export type UnPublishDatasetPayload = OperationInfo | TypeDataset;

export type UnpublishUseCasePayload = OperationInfo | TypeUseCase;

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

export type UpdateUsecaseDatasetsPayload = OperationInfo | TypeUseCase;

/** UseCase(id, title, description, logo, created, modified, website, contact_email, slug, status) */
export type UseCaseFilter = {
  AND?: InputMaybe<UseCaseFilter>;
  DISTINCT?: InputMaybe<Scalars['Boolean']>;
  NOT?: InputMaybe<UseCaseFilter>;
  OR?: InputMaybe<UseCaseFilter>;
  id?: InputMaybe<Scalars['ID']>;
  slug?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<UseCaseStatus>;
};

/** UseCase(id, title, description, logo, created, modified, website, contact_email, slug, status) */
export type UseCaseInput = {
  contactEmail?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  logo?: InputMaybe<Scalars['Upload']>;
  modified?: InputMaybe<Scalars['DateTime']>;
  slug?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<ApiUseCaseStatusEnum>;
  title?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

/** UseCase(id, title, description, logo, created, modified, website, contact_email, slug, status) */
export type UseCaseInputPartial = {
  contactEmail?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  logo?: InputMaybe<Scalars['Upload']>;
  modified?: InputMaybe<Scalars['DateTime']>;
  slug?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<ApiUseCaseStatusEnum>;
  title?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type UseCaseOrder = {
  created?: InputMaybe<Ordering>;
  modified?: InputMaybe<Ordering>;
  title?: InputMaybe<Ordering>;
};

export enum UseCaseStatus {
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED'
}

export enum ValidatorType {
  MinLength = 'MIN_LENGTH',
  Range = 'RANGE',
  Regex = 'REGEX'
}

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