import { MediaRendering } from '@/components/media-rendering';
import { render, screen } from '@testing-library/react';

jest.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: jest.fn(),
}));

import { useMediaQuery } from '@/hooks/use-media-query';

describe('MediaRendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when min-width query matches', () => {
    (useMediaQuery as jest.Mock)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    render(
      <MediaRendering minWidth="768" maxWidth="1024">
        <span>Visible content</span>
      </MediaRendering>
    );

    expect(screen.getByText('Visible content')).toBeInTheDocument();
  });

  it('renders children when max-width query matches', () => {
    (useMediaQuery as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    render(
      <MediaRendering minWidth="768" maxWidth="1024">
        <span>Mobile content</span>
      </MediaRendering>
    );

    expect(screen.getByText('Mobile content')).toBeInTheDocument();
  });

  it('hides children when no query matches', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);

    render(
      <MediaRendering minWidth="768" maxWidth="1024">
        <span>Hidden content</span>
      </MediaRendering>
    );

    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });
});
