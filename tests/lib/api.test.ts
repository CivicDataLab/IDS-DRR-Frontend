import { fetchDatasets, GraphQL } from '@/lib/api';

jest.mock('graphql-request', () => ({
  request: jest.fn(),
}));

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}));

import { captureException } from '@sentry/nextjs';
import { request } from 'graphql-request';

const document = {} as any;

describe('GraphQL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns data on success', async () => {
    (request as jest.Mock).mockResolvedValue({ items: [1, 2] });

    await expect(GraphQL('http://localhost/graphql', document, {})).resolves.toEqual({
      items: [1, 2],
    });
    expect(request).toHaveBeenCalledWith('http://localhost/graphql', document, {});
  });

  it('captures and rethrows errors', async () => {
    const error = new Error('network');
    (request as jest.Mock).mockRejectedValue(error);

    await expect(GraphQL('http://localhost/graphql', document, {})).rejects.toThrow(
      'network'
    );
    expect(captureException).toHaveBeenCalledWith(error);
  });
});

describe('fetchDatasets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost';
  });

  it('fetches dataset search results', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ results: ['a'] }),
    });

    await expect(fetchDatasets('flood')).resolves.toEqual({ results: ['a'] });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost/api/search/dataset/flood'
    );
  });
});
