import { dehydrate, Hydrate } from '@tanstack/react-query';

import { DATASET_BY_SLUG } from '@/config/graphql/dataset-queries';
import { getQueryClient, GraphQL } from '@/lib/api';
import { Content } from './components/dataset-explorer';

export default async function DatasetExplorer({
  params,
}: {
  params: { dataset: string };
}) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery([`dataset_by_slug_${params.dataset}`], () =>
    GraphQL(`${process.env.BACKEND_URL}/graphql`, DATASET_BY_SLUG, {
      dataset_slug: params.dataset,
    })
  );
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Content slug={params.dataset} />
    </Hydrate>
  );
}
