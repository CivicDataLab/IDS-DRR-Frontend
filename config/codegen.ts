import type { CodegenConfig } from '@graphql-codegen/cli';

if (!process.env.DATA_MANAGEMENT_LAYER_URL && !process.env.BACKEND_URL) {
  console.log(
    '[codegen] Neither DATA_MANAGEMENT_LAYER_URL nor BACKEND_URL is set; skipping.'
  );
  process.exit(0);
}

const generates: CodegenConfig['generates'] = {};

if (process.env.DATA_MANAGEMENT_LAYER_URL) {
  generates['./gql/generated/analytics/'] = {
    documents: 'config/**/analaytics-queries.ts',
    schema: `${process.env.DATA_MANAGEMENT_LAYER_URL}/graphql`,
    preset: 'client',
    plugins: [],
  };
}

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
