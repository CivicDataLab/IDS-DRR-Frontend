jest.unmock('@/hooks/use-analytics-module');

import { useAnalyticsModule } from '@/hooks/use-analytics-module';
import { renderHook } from '@testing-library/react';

const mockUseParams = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: () => mockUseParams(),
}));

describe('useAnalyticsModule', () => {
  it('returns the module route segment', () => {
    mockUseParams.mockReturnValue({ module: 'heat', state: 'odisha' });

    const { result } = renderHook(() => useAnalyticsModule());

    expect(result.current).toBe('heat');
  });

  it('throws when the module segment is missing', () => {
    mockUseParams.mockReturnValue({ state: 'odisha' });

    expect(() => renderHook(() => useAnalyticsModule())).toThrow(
      'useAnalyticsModule: expected [module] route segment (analytics pages only).'
    );
  });
});
