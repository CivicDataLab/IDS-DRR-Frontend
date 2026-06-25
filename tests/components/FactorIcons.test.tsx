import {
  Ellipse,
  Exposure,
  FloodHazard,
  GovtResponse,
  RiskScore,
  Vulnerability,
} from '@/components/FactorIcons';
import { render } from '@testing-library/react';

const icons = [
  { name: 'Vulnerability', Component: Vulnerability },
  { name: 'RiskScore', Component: RiskScore },
  { name: 'FloodHazard', Component: FloodHazard },
  { name: 'Exposure', Component: Exposure },
  { name: 'GovtResponse', Component: GovtResponse },
  { name: 'Ellipse', Component: Ellipse },
];

describe.each(icons)('$name icon', ({ Component }) => {
  it('renders an SVG with the given fill color', () => {
    const { container } = render(<Component color="#123456" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(container.querySelector('[fill="#123456"]')).toBeInTheDocument();
  });
});
