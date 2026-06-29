import { cache } from 'react';

import { PLATFORM_STATES_LIST } from '@/config/graphql/analaytics-queries';
import { getQueryClient, GraphQL } from '@/lib/api';

export const fetchStatesList = cache(async (moduleSlug: string) => {
  const queryClient = getQueryClient();

  return queryClient
    .fetchQuery({
      queryKey: [`states_list_${moduleSlug}`],
      queryFn: () =>
        GraphQL(
          `${process.env.DATA_MANAGEMENT_LAYER_URL}/graphql`,
          PLATFORM_STATES_LIST,
          { module: moduleSlug }
        ),
    })
    .then((res) => res?.getStates)
    .catch(() => []);
});
