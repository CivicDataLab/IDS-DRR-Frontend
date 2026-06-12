import React from 'react';
import { useCopyURL } from '@/hooks/use-copy-url';
import { act, renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import messages from '../../locales/en.json';

jest.mock('@/lib/utils', () => ({
  copyToClipboard: jest.fn(),
}));

import { copyToClipboard } from '@/lib/utils';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(NextIntlClientProvider, {
    locale: 'en',
    messages,
    children,
  });

describe('useCopyURL', () => {
  const alert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = alert;
  });

  it('alerts success when copy succeeds', async () => {
    (copyToClipboard as jest.Mock).mockResolvedValue(true);
    const { result } = renderHook(() => useCopyURL(), { wrapper });

    await act(async () => {
      await result.current('https://example.com');
    });

    expect(copyToClipboard).toHaveBeenCalledWith('https://example.com');
    expect(alert).toHaveBeenCalledWith('URL copied to clipboard!');
  });

  it('alerts error when copy fails', async () => {
    (copyToClipboard as jest.Mock).mockResolvedValue(false);
    const { result } = renderHook(() => useCopyURL(), { wrapper });

    await act(async () => {
      await result.current();
    });

    expect(copyToClipboard).toHaveBeenCalledWith(window.location.href);
    expect(alert).toHaveBeenCalledWith('Failed to copy URL.');
  });
});
