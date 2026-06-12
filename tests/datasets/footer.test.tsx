import Footer from '@/app/[locale]/datasets/components/footer';
import GraphqlPagination from '@/app/[locale]/datasets/components/GraphqlPagination';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('opub-ui');

describe('Footer pagination', () => {
  it('navigates pages and changes page size', async () => {
    const onPageChange = jest.fn();
    const onPageSizeChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Footer
        totalRows={25}
        pageSize={5}
        currentPage={2}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next Page' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    await user.selectOptions(screen.getByRole('combobox'), '10');
    expect(onPageSizeChange).toHaveBeenCalledWith(10);
  });

  it('disables previous controls on the first page', () => {
    render(
      <Footer
        totalRows={10}
        pageSize={5}
        currentPage={1}
        onPageChange={jest.fn()}
        onPageSizeChange={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'First Page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous Page' })).toBeDisabled();
  });
});

describe('GraphqlPagination', () => {
  it('renders children with the footer controls', async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();

    render(
      <GraphqlPagination
        totalRows={10}
        pageSize={5}
        currentPage={1}
        onPageChange={onPageChange}
        onPageSizeChange={jest.fn()}
      >
        <div>Dataset rows</div>
      </GraphqlPagination>
    );

    expect(screen.getByText('Dataset rows')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Last Page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
