import { useModuleHubStats } from '@/hooks/use-module-hub-stats';
import { renderHook, waitFor } from '@testing-library/react';

const mockUseQuery = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQuery: (options: { queryKey: unknown[]; enabled?: boolean }) =>
    mockUseQuery(options),
}));

jest.mock('@/lib/api', () => ({
  GraphQL: jest.fn(),
}));

function queryResult(
  data: unknown,
  isLoading = false
): { data: unknown; isLoading: boolean } {
  return { data, isLoading };
}

describe('useModuleHubStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseQuery.mockImplementation(({ queryKey }) => {
      const key = String(queryKey[0]);

      if (key.startsWith('states_list')) {
        return queryResult({
          getStates: [
            {
              slug: 'odisha',
              code: '21',
              latest_time_period: '2024_10',
            },
          ],
        });
      }

      if (key.startsWith('timePeriods')) {
        return queryResult({
          getDataTimePeriods: [{ value: '2024_10' }],
        });
      }

      if (key.startsWith('geographies_data_district')) {
        return queryResult({
          getDistrictRevCircle: [{ code: '21-387' }, { code: '21-388' }],
        });
      }

      if (key.startsWith('mapQuery_district')) {
        return queryResult({
          districtMapData: {
            features: [
              { properties: { 'risk-score': 5 } },
              { properties: { 'risk-score': 3 } },
            ],
          },
        });
      }

      return queryResult(undefined);
    });
  });

  it('returns district and very-high-risk counts when data is loaded', async () => {
    const { result } = renderHook(() => useModuleHubStats('odisha', 'flood'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.districtCount).toBe(2);
    expect(result.current.veryHighRiskCount).toBe(1);
  });

  it('skips queries when state slug is missing', () => {
    renderHook(() => useModuleHubStats(undefined, 'flood'));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false })
    );
  });

  it('reports loading while any query is in flight', () => {
    mockUseQuery.mockImplementation(({ queryKey }) => {
      const key = String(queryKey[0]);

      if (key.startsWith('mapQuery_district')) {
        return queryResult(undefined, true);
      }

      return queryResult(undefined, false);
    });

    const { result } = renderHook(() => useModuleHubStats('odisha', 'flood'));

    expect(result.current.isLoading).toBe(true);
  });
});
