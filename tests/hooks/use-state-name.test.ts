import React from 'react';
import { useStateName } from '@/hooks/use-state-name';
import { renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import messages from '../../locales/en.json';

const messagesWithStates = {
  ...messages,
  states: {
    assam: 'Translated Assam',
  },
};

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(NextIntlClientProvider, {
    locale: 'en',
    messages: messagesWithStates,
    children,
  });

describe('useStateName', () => {
  it('returns translated state name when available', () => {
    const { result } = renderHook(() => useStateName(), { wrapper });
    expect(result.current('assam', 'Assam')).toBe('Translated Assam');
  });

  it('falls back to the provided name when no translation exists', () => {
    const { result } = renderHook(() => useStateName(), { wrapper });
    expect(result.current('unknown-state', 'Fallback Name')).toBe(
      'Fallback Name'
    );
  });
});
