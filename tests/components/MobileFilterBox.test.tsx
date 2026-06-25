import { MobileFilterBox } from '@/components/MobileFilterBox';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('opub-ui');

jest.mock('@/components/icons', () => ({
  __esModule: true,
  default: { cross: 'cross' },
}));

const filterOptions = [
  { title: 'Division', value: 'division', type: 'select' },
  { title: 'Indicator', value: 'indicator', type: 'select' },
];

describe('MobileFilterBox', () => {
  it('renders filter options and handles actions', async () => {
    const onSelectedOption = jest.fn();
    const handleApplyFilters = jest.fn();
    const handleClearFilters = jest.fn();
    const toggleDrawerCallback = jest.fn();
    const user = userEvent.setup();

    render(
      <MobileFilterBox
        open
        filterOptions={filterOptions}
        onSelectedOption={onSelectedOption}
        handleApplyFilters={handleApplyFilters}
        handleClearFilters={handleClearFilters}
        toggleDrawerCallback={toggleDrawerCallback}
      >
        <div>Filter body</div>
      </MobileFilterBox>
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Filter body')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Indicator' }));
    expect(onSelectedOption).toHaveBeenCalledWith('indicator');

    await user.click(screen.getByRole('button', { name: 'Clear All' }));
    expect(handleClearFilters).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(handleApplyFilters).toHaveBeenCalled();
    expect(toggleDrawerCallback).toHaveBeenCalled();
  });
});
