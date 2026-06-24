import React from 'react';
import { MapLayerToggle } from '@/components/analytics/map-layer-toggle';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('MapLayerToggle', () => {
  it('renders aggregated and localized labels', () => {
    render(<MapLayerToggle value="vector" onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Aggregated' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Localized' })).toBeInTheDocument();
  });

  it('calls onChange with vector or raster when buttons are clicked', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<MapLayerToggle value="vector" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Localized' }));
    expect(onChange).toHaveBeenCalledWith('raster');

    await user.click(screen.getByRole('button', { name: 'Aggregated' }));
    expect(onChange).toHaveBeenCalledWith('vector');
  });

  it('applies optional className', () => {
    const { container } = render(
      <MapLayerToggle
        value="raster"
        onChange={jest.fn()}
        className="custom-toggle"
      />
    );

    expect(container.firstChild).toHaveClass('custom-toggle');
  });
});
