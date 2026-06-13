import { type DocumentType, graphql } from '@/gql/generated/datasets';

export const DATASET_QUERY = graphql(`
  query datasets($filters: DatasetFilter) {
    datasets(filters: $filters) {
      tags {
        id
        value
      }
      id
      title
      description
      created
      modified
      metadata {
        metadataItem {
          id
          label
        }
        value
      }
      resources {
        id
        created
        modified
        type
        name
        description
      }
      categories {
        name
      }
      formats
    }
  }
`);

/** A single dataset as returned by the `datasets` query. */
export type Dataset = DocumentType<typeof DATASET_QUERY>['datasets'][number];

export const CHARTS_QUERY = graphql(`
  query chartsData($datasetId: UUID!) {
    chartsDetails(datasetId: $datasetId) {
      chartType
      description
      id
      name
      options {
        aggregateType
        xAxisColumn {
          id
          fieldName
        }
        yAxisColumn {
          field {
            id
            fieldName
          }
        }
        showLegend
        xAxisLabel
        yAxisLabel
        regionColumn {
          id
          fieldName
        }
        valueColumn {
          id
          fieldName
        }
      }
      chart
    }
  }
`);

export const DATASET_RESOURCES_QUERY = graphql(`
  query datasetResources($datasetId: UUID!) {
    datasetResources(datasetId: $datasetId) {
      id
      created
      modified
      type
      name
      description
      accessModels {
        name
        description
        type
        modelResources {
          fields {
            format
            fieldName
            description
          }
        }
      }
      schema {
        fieldName
        id
        format
        description
      }
      fileDetails {
        format
      }
    }
  }
`);
