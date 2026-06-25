import { InfoSquare } from '@/components/InfoCircle';
import { render } from '@testing-library/react';

describe('InfoSquare', () => {
  it('renders an SVG with the given stroke color', () => {
    const { container } = render(<InfoSquare color="#ff0000" data-testid="info" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(container.querySelectorAll('path')[0]).toHaveAttribute(
      'stroke',
      '#ff0000'
    );
  });
});
