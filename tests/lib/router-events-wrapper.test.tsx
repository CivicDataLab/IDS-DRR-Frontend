import { HandleOnComplete } from '@/lib/router-events/wrapper';
import { render } from '@testing-library/react';

jest.mock('nprogress', () => ({
  done: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/datasets'),
  useSearchParams: jest.fn(() => new URLSearchParams('page=1')),
}));

import NProgress from 'nprogress';

describe('HandleOnComplete', () => {
  it('completes the progress bar when the route changes', () => {
    render(<HandleOnComplete />);
    expect(NProgress.done).toHaveBeenCalled();
  });
});
