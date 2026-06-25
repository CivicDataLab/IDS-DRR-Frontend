import React from 'react';
import { ScoreInfo } from '@/app/[locale]/[state]/analytics/components/score-info';
import { render, screen } from '@testing-library/react';

jest.mock('opub-ui');

jest.mock('@/hooks/use-format-number', () => ({
  useFormatNumber: () => (value: number | string) => `formatted-${value}`,
}));

jest.mock('@/lib/analytics', () => ({
  isRiskLevel: (value: string) => ['1', '2', '3', '4', '5'].includes(value),
  RiskColorMap: {
    '1': '#00ff00',
    '2': '#ffff00',
    '3': '#ffa500',
    '4': '#ff0000',
    '5': '#800000',
  },
}));

describe('ScoreInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders progress bar for risk-score indicator', () => {
    render(
      <ScoreInfo
        label="Risk Score"
        value="4"
        indicator="risk-score"
      />
    );

    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('data-value', '80');
    expect(progressBar).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('renders formatted value for non-risk-score indicator', () => {
    render(
      <ScoreInfo
        label="Population"
        value="1000000"
        indicator="population"
      />
    );

    expect(screen.getByText('Population')).toBeInTheDocument();
    expect(screen.getByText('formatted-1000000')).toBeInTheDocument();
  });

  it('handles missing indicator description', () => {
    render(
      <ScoreInfo
        label="Test Factor"
        value="3"
        indicator="test-factor"
      />
    );

    expect(screen.getByText('Test Factor')).toBeInTheDocument();
  });

  it('handles different risk score values', () => {
    const { rerender } = render(
      <ScoreInfo
        label="Risk Score"
        value="1"
        indicator="risk-score"
      />
    );

    let progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveAttribute('data-value', '20');
    expect(progressBar).toHaveStyle({ backgroundColor: '#00ff00' });

    rerender(
      <ScoreInfo
        label="Risk Score"
        value="5"
        indicator="risk-score"
      />
    );

    progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveAttribute('data-value', '100');
    expect(progressBar).toHaveStyle({ backgroundColor: '#800000' });
  });
});
