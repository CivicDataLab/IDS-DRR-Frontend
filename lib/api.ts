import React from 'react';
import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { captureException } from '@sentry/nextjs';
import { QueryClient } from '@tanstack/react-query';
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
  } catch (error: unknown) {
    captureException(error);
    throw error;
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

export const fetchDatasets = async (variables: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search/dataset/${variables}`
  );
  const data = await response.json();
  return data;
};
