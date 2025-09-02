// useCounter.test.tsx
import { useKeyDetect } from '@/hooks/use-key-detect';
import { fireEvent, renderHook, waitFor } from '@testing-library/react';

describe('useCounter', () => {
  test('should render the initial count', () => {
    const { result } = renderHook(useKeyDetect);
    expect(result.current.key).toBe('');
    expect(result.current.metaKey).toBe(false);
  });
  test('should return the correct key and metaKey', () => {
    const { result } = renderHook(useKeyDetect);
    expect(result.current.key).toBe('');
    expect(result.current.metaKey).toBe(false);
    fireEvent.keyDown(window, { key: 'a', metaKey: false });
    expect(result.current.key).toBe('a');
    expect(result.current.metaKey).toBe(false);
    fireEvent.keyDown(window, { key: 'b', metaKey: true });
    expect(result.current.key).toBe('b');
    expect(result.current.metaKey).toBe(true);
  });
  test('should reset the key and metaKey after 1 millisecond', async () => {
    const { result } = renderHook(useKeyDetect);
    expect(result.current.key).toBe('');
    expect(result.current.metaKey).toBe(false);
    fireEvent.keyDown(window, { key: 'a', metaKey: false });
    expect(result.current.key).toBe('a');
    expect(result.current.metaKey).toBe(false);
    waitFor(() => {
      expect(result.current.key).toBe('');
      expect(result.current.metaKey).toBe(false);
    });
  });
});
