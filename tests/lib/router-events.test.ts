import { onComplete, onStart } from '@/lib/router-events/events';

jest.mock('nprogress', () => ({
  start: jest.fn(),
  done: jest.fn(),
}));

import NProgress from 'nprogress';

describe('router events', () => {
  it('starts and completes NProgress', () => {
    onStart();
    onComplete();
    expect(NProgress.start).toHaveBeenCalled();
    expect(NProgress.done).toHaveBeenCalled();
  });
});
