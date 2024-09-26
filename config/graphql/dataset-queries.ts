import { graphql } from '@/gql/generated/datasets';
import { gql } from 'graphql-request';

export const DATASET_QUERY: any = gql`
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
`;

export const CHARTS_QUERY: any = gql`
  query chartsData($datasetId: UUID!) {
    chartsDetails(datasetId: $datasetId) {
      aggregateType
      chartType
      description
      id
      name
      showLegend
      xAxisLabel
      yAxisLabel
      chart
    }
  }
`;

export const DATASET_RESOURCES_QUERY: any = gql`
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
`;
