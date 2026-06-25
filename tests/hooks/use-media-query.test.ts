import { useMediaQuery } from '@/hooks/use-media-query';
import { act, renderHook } from '@testing-library/react';

describe('useMediaQuery', () => {
  let listeners: Array<() => void>;
  let matches = false;

  beforeEach(() => {
    listeners = [];
    matches = false;
    window.matchMedia = jest.fn().mockImplementation(() => ({
      get matches() {
        return matches;
      },
      media: '(min-width: 768px)',
      addEventListener: (_: string, listener: () => void) => {
        listeners.push(listener);
      },
      removeEventListener: (_: string, listener: () => void) => {
        listeners = listeners.filter((l) => l !== listener);
      },
    }));
  });

  it('returns false when the query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('updates when the media query match changes', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    act(() => {
      matches = true;
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe(true);
  });
});
