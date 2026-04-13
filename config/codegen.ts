import type { CodegenConfig } from '@graphql-codegen/cli';

const generates: CodegenConfig['generates'] = {
  './gql/generated/analytics/': {
    documents: 'config/**/analaytics-queries.ts',
    schema: `${process.env.DATA_MANAGEMENT_LAYER_URL}/graphql`,
    preset: 'client',
    plugins: [],
  },
};

if (process.env.BACKEND_URL) {
  generates['./gql/generated/datasets/'] = {
    documents: 'config/**/dataset-queries.ts',
    schema: `${process.env.BACKEND_URL}/api/graphql`,
    preset: 'client',
    plugins: [],
  };
}

const config: CodegenConfig = {
  overwrite: true,
  generates,
};

export default config;
