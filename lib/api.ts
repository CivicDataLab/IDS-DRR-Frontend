import React from 'react';
import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { request } from 'graphql-request';

// create a wrapper function for graphql-request
// that will be used by react-query
export async function GraphQL<TResult, TVariables>(
  url: string,
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const data = await request(url, document, {
    ...variables,
  });
  return data;
}

// wrapper function for react-query to be used by server components
export const getQueryClient = React.cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
      },
    })
);

export function useFetch(id: string, query: string) {
  return useQuery({
    queryKey: [id],

    queryFn: async () => {
      try {
        const data = await fetch(query).then((res) => res.json());
        return data;
      } catch (error: any) {
        throw new Error(error);
      }
    },
  });
}

export async function getData(query: string) {
  try {
    const res = await fetch(query, {
      cache: 'no-cache',
    });
    return res.json();
  } catch (err) {
    console.log('error ', err);
  }
}
