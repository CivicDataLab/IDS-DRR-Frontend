import React from 'react';
import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { captureException } from '@sentry/nextjs';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { request } from 'graphql-request';

// create a wrapper function for graphql-request
// that will be used by react-query
export async function GraphQL<TResult, TVariables>(
  url: string,
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  try {
    const data = await request(url, document, {
      ...variables,
    });
    return data;
  } catch (error: any) {
    captureException(error);
  }
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
        // const data = await fetch(query, { cache: 'no-store' }).then((res) =>
        //   res.json()
        // );
        return data;
      } catch (error: any) {
        captureException(error);
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
    captureException(err);
    console.log('error ', err);
  }
}

export const fetchDatasets = async (variables: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/dataset/${variables}`
      // `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/dataset/${variables}`,
      // { cache: 'no-store' }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    captureException(error);
  }
};
