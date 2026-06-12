import Filter from '@/app/[locale]/datasets/components/Filter';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('opub-ui');

jest.mock('@/components/icons', () => ({
  __esModule: true,
  default: { cross: 'cross-icon' },
}));

const options = {
  categories: [
    { label: 'climate', value: 'climate' },
    { label: 'hydrology', value: 'hydrology' },
  ],
};

describe('Filter', () => {
  it('renders filter categories and applies checkbox selections', async () => {
    const setSelectedOptions = jest.fn();
    const user = userEvent.setup();

    render(
      <Filter
        options={options}
        selectedOptions={{}}
        setSelectedOptions={setSelectedOptions}
      />
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();

    await user.click(screen.getByLabelText('climate'));
    expect(setSelectedOptions).toHaveBeenCalledWith('categories', ['climate']);
  });

  it('resets all selected filters', async () => {
    const setSelectedOptions = jest.fn();
    const user = userEvent.setup();

    render(
      <Filter
        options={options}
        selectedOptions={{ categories: ['climate'] }}
        setSelectedOptions={setSelectedOptions}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(setSelectedOptions).toHaveBeenCalledWith('categories', []);
  });

  it('closes the mobile tray when a close handler is provided', async () => {
    const setOpen = jest.fn();
    const user = userEvent.setup();

    render(
      <Filter
        options={options}
        selectedOptions={{}}
        setSelectedOptions={jest.fn()}
        setOpen={setOpen}
      />
    );

    await user.click(screen.getByTestId('icon').closest('button')!);
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
