import { useLockBody } from '@/hooks/use-lock-body';
import { renderHook } from '@testing-library/react';

describe('useLockBody', () => {
  it('locks body scroll on mount and restores on unmount', () => {
    document.body.style.overflow = 'auto';
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({
      overflow: 'auto',
    } as CSSStyleDeclaration);

    const { unmount } = renderHook(() => useLockBody());
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });
});
