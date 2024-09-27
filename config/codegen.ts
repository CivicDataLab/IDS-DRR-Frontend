import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    './gql/generated/datasets/': {
      documents: 'config/**/dataset-queries.ts',
      schema: `${process.env.BACKEND_URL}/api/graphql`,
      preset: 'client',
      plugins: [],
    },
    './gql/generated/analytics/': {
      documents: 'config/**/analaytics-queries.ts',
      schema: `${process.env.DATA_MANAGEMENT_LAYER_URL}/graphql`,
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
