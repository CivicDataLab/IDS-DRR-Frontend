import React from 'react';
import { useDynamicTranslations } from '@/hooks/use-dynamic-translations';
import { renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import messages from '../../locales/en.json';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(NextIntlClientProvider, { locale: 'en', messages }, children);

describe('useDynamicTranslations', () => {
  it('returns a translation function for arbitrary keys', () => {
    const { result } = renderHook(() => useDynamicTranslations('common'), {
      wrapper,
    });
    expect(result.current('na')).toBe('NA');
  });
});
