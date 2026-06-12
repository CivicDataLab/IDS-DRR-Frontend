import { useWindowSize } from '@/hooks/use-window-size';
import { act, renderHook } from '@testing-library/react';

describe('useWindowSize', () => {
  it('returns current window dimensions and updates on resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useWindowSize());
    expect(result.current).toEqual({ width: 1024, height: 768 });

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: 1280,
      });
      Object.defineProperty(window, 'innerHeight', {
        configurable: true,
        value: 800,
      });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toEqual({ width: 1280, height: 800 });
  });
});
