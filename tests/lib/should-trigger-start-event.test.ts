/**
 * @jest-environment node
 */

jest.mock('next/dist/client/add-base-path', () => ({
  addBasePath: (href: string) => href,
}));

const mockLocation = {
  href: 'http://localhost:3000/assam/flood/analytics?view=map',
  origin: 'http://localhost:3000',
  pathname: '/assam/flood/analytics',
  search: '?view=map',
};

Object.defineProperty(globalThis, 'location', {
  value: mockLocation,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, 'window', {
  value: { location: mockLocation },
  writable: true,
  configurable: true,
});

import { shouldTriggerStartEvent } from '@/lib/router-events/patch-router/should-trigger-start-event';

describe('shouldTriggerStartEvent', () => {
  it('returns true for internal navigation to a different path', () => {
    expect(shouldTriggerStartEvent('/datasets')).toBe(true);
  });

  it('returns false for the same URL', () => {
    expect(shouldTriggerStartEvent('/assam/flood/analytics?view=map')).toBe(false);
  });

  it('returns false for external URLs', () => {
    expect(shouldTriggerStartEvent('https://example.com/page')).toBe(false);
  });

  it('returns false for modified click events', () => {
    const event = {
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      currentTarget: { getAttribute: () => null },
      nativeEvent: { button: 0 },
    } as unknown as React.MouseEvent;

    expect(shouldTriggerStartEvent('/datasets', event)).toBe(false);
  });

  it('returns false when opening in a new tab', () => {
    const event = {
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      currentTarget: { getAttribute: () => '_blank' },
      nativeEvent: { button: 0 },
    } as unknown as React.MouseEvent;

    expect(shouldTriggerStartEvent('/datasets', event)).toBe(false);
  });
});
