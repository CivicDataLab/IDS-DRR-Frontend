import React from 'react';
import { useFormatPeriod } from '@/hooks/use-format-period';
import { renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import { formats } from '../../i18n/formats';
import messages from '../../locales/en.json';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(NextIntlClientProvider, {
    locale: 'en',
    messages,
    formats,
    children,
  });

describe('useFormatPeriod', () => {
  it('formats a valid ISO date as month-year', () => {
    const { result } = renderHook(() => useFormatPeriod(), { wrapper });
    expect(result.current('2024-09-16')).toBe('September 2024');
  });

  it('returns localized NA for blank input', () => {
    const { result } = renderHook(() => useFormatPeriod(), { wrapper });
    expect(result.current(null)).toBe('NA');
    expect(result.current(undefined)).toBe('NA');
    expect(result.current('')).toBe('NA');
  });
});
