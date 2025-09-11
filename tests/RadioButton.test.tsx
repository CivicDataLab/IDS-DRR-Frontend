import React from 'react';
import RadioButton from '@/app/[locale]/[state]/analytics/components/RadioButton';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock opub-ui components
jest.mock('opub-ui');

describe('RadioButton', () => {
  const mockChanged = jest.fn();

  const defaultProps = {
    value: 'option1',
    id: 'radio1',
    label: 'Option 1',
    isSelected: false,
    changed: mockChanged,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders radio button with correct props', () => {
    render(<RadioButton {...defaultProps} />);

    const radioInput = screen.getByRole('radio');
    const label = screen.getByText('Option 1');

    expect(radioInput).toBeInTheDocument();
    expect(radioInput).toHaveAttribute('value', 'option1');
    expect(radioInput).toHaveAttribute('id', 'radio1');
    expect(radioInput).not.toBeChecked();
    expect(label).toBeInTheDocument();
  });

  it('renders selected radio button correctly', () => {
    render(<RadioButton {...defaultProps} isSelected={true} />);

    const radioInput = screen.getByRole('radio');
    expect(radioInput).toBeChecked();
    expect(radioInput).toHaveAttribute('aria-checked', 'true');
  });

  it('renders unselected radio button correctly', () => {
    render(<RadioButton {...defaultProps} isSelected={false} />);

    const radioInput = screen.getByRole('radio');
    expect(radioInput).not.toBeChecked();
    expect(radioInput).toHaveAttribute('aria-checked', 'false');
  });

  it('calls changed function when radio button is clicked', () => {
    render(<RadioButton {...defaultProps} />);

    const radioInput = screen.getByRole('radio');
    fireEvent.click(radioInput);

    expect(mockChanged).toHaveBeenCalledWith('option1');
  });

  it('calls changed function when label is clicked', () => {
    render(<RadioButton {...defaultProps} />);

    const label = screen.getByText('Option 1');
    fireEvent.click(label);

    expect(mockChanged).toHaveBeenCalledWith('option1');
  });

  it('has correct accessibility attributes', () => {
    render(<RadioButton {...defaultProps} />);

    const radioInput = screen.getByRole('radio');
    const label = document.querySelector('label[for="radio1"]');

    expect(radioInput).toHaveAttribute('aria-checked', 'false');
    expect(label).toHaveAttribute('aria-label', 'Option 1');
    expect(label).toHaveAttribute('title', 'Option 1');
    expect(label).toHaveAttribute('for', 'radio1');
  });

  it('has correct accessibility attributes when selected', () => {
    render(<RadioButton {...defaultProps} isSelected={true} />);

    const radioInput = screen.getByRole('radio');
    expect(radioInput).toHaveAttribute('aria-checked', 'true');
  });

  it('renders with different values', () => {
    render(<RadioButton {...defaultProps} value="different-value" />);

    const radioInput = screen.getByRole('radio');
    expect(radioInput).toHaveAttribute('value', 'different-value');
  });

  it('renders with different labels', () => {
    render(<RadioButton {...defaultProps} label="Different Label" />);

    expect(screen.getByText('Different Label')).toBeInTheDocument();
  });

  it('renders with different IDs', () => {
    render(<RadioButton {...defaultProps} id="different-id" />);

    const radioInput = screen.getByRole('radio');
    const label = document.querySelector('label[for="different-id"]');

    expect(radioInput).toHaveAttribute('id', 'different-id');
    expect(label).toHaveAttribute('for', 'different-id');
  });

  it('handles click event correctly', () => {
    render(<RadioButton {...defaultProps} />);

    const radioInput = screen.getByRole('radio');
    fireEvent.click(radioInput);

    expect(mockChanged).toHaveBeenCalledWith('option1');
  });

  it('renders multiple radio buttons correctly', () => {
    render(
      <div>
        <RadioButton {...defaultProps} />
        <RadioButton
          {...defaultProps}
          value="option2"
          id="radio2"
          label="Option 2"
          isSelected={true}
        />
      </div>
    );

    const radioInputs = screen.getAllByRole('radio');
    expect(radioInputs).toHaveLength(2);
    expect(radioInputs[0]).not.toBeChecked();
    expect(radioInputs[1]).toBeChecked();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('has correct CSS class', () => {
    render(<RadioButton {...defaultProps} />);

    const container = screen.getByRole('radio').closest('.RadioButton');
    expect(container).toBeInTheDocument();
  });
});
