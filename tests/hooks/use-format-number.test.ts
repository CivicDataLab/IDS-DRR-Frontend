import React from 'react';
import { useFormatNumber } from '@/hooks/use-format-number';
import { renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import messages from '../../locales/en.json';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(NextIntlClientProvider, {
    locale: 'en',
    messages,
    children,
  });

describe('useFormatNumber', () => {
  it('formats plain numbers', () => {
    const { result } = renderHook(() => useFormatNumber(), { wrapper });
    expect(result.current(1234.5)).toBe('1,234.5');
  });

  it('preserves trailing units', () => {
    const { result } = renderHook(() => useFormatNumber(), { wrapper });
    expect(result.current('12.5 mm')).toBe('12.5 mm');
  });

  it('returns empty string for nullish input', () => {
    const { result } = renderHook(() => useFormatNumber(), { wrapper });
    expect(result.current(null as unknown as string)).toBe('');
    expect(result.current(undefined as unknown as string)).toBe('');
  });

  it('returns non-numeric strings unchanged', () => {
    const { result } = renderHook(() => useFormatNumber(), { wrapper });
    expect(result.current('N/A')).toBe('N/A');
  });
});
