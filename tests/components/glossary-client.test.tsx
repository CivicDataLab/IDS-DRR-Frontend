import GlossaryClient from '@/components/glossary/glossary-client';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { GlossaryTerm } from 'ids-drr-branding-types';

import messages from '../../locales/en.json';

jest.mock('opub-ui');

const terms: GlossaryTerm[] = [
  {
    term: 'Exposure',
    tag: 'Risk',
    summary: 'People and assets in hazard zones',
    definition: 'Exposure measures what is at risk.',
    methodology: 'Used in the composite risk score.',
    usage: 'Analytics dashboard',
    significance: 'Drives prioritization.',
    interpretation: { policy: 'Policy context', model: 'Model context' },
    disasterMethodology: [
      { disasterType: 'Flood', methodology: 'Flood-specific approach' },
    ],
    related: ['Vulnerability', 'Hazard'],
    misinterpretation: 'Not the same as hazard.',
  },
  {
    term: 'Hazard',
    tag: 'Risk',
    summary: 'Potential physical event',
    definition: 'Hazard is the natural event threat.',
    methodology: 'Derived from historical events.',
    usage: 'Risk maps',
    significance: 'Primary input to risk.',
  },
  {
    term: 'Resilience',
    tag: 'Capacity',
    summary: 'Ability to recover',
    definition: 'Capacity to absorb shocks.',
    methodology: 'Measured via response indicators.',
    usage: 'Planning tools',
    significance: 'Long-term adaptation.',
  },
];

describe('GlossaryClient', () => {
  it('renders terms grouped by letter with tag filters', () => {
    render(<GlossaryClient terms={terms} />);

    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
    expect(screen.getByText('Exposure')).toBeInTheDocument();
    expect(screen.getByText('Hazard')).toBeInTheDocument();
    expect(screen.getByText('Resilience')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Risk')).toBeInTheDocument();
    expect(screen.getByText('Capacity')).toBeInTheDocument();
  });

  it('filters terms by search query', async () => {
    const user = userEvent.setup();
    render(<GlossaryClient terms={terms} />);

    await user.type(screen.getByLabelText('Search'), 'expo');

    expect(screen.getByText('Exposure')).toBeInTheDocument();
    expect(screen.queryByText('Hazard')).not.toBeInTheDocument();
    expect(screen.queryByText('Resilience')).not.toBeInTheDocument();
  });

  it('filters terms by tag', async () => {
    const user = userEvent.setup();
    render(<GlossaryClient terms={terms} />);

    await user.click(screen.getByText('Capacity'));

    expect(screen.getByText('Resilience')).toBeInTheDocument();
    expect(screen.queryByText('Exposure')).not.toBeInTheDocument();
    expect(screen.queryByText('Hazard')).not.toBeInTheDocument();
  });

  it('shows empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<GlossaryClient terms={terms} />);

    await user.type(screen.getByLabelText('Search'), 'zzzznotfound');

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('expands a term to show full detail sections', async () => {
    const user = userEvent.setup();
    render(<GlossaryClient terms={terms} />);

    await user.click(
      screen.getByRole('button', { name: /Exposure/i })
    );

    expect(screen.getByText('Definition')).toBeInTheDocument();
    expect(
      screen.getByText('Exposure measures what is at risk.')
    ).toBeInTheDocument();
    expect(
      screen.getByText(messages.glossary.detail.headings.methodology)
    ).toBeInTheDocument();
    expect(screen.getByText('Contextual interpretation')).toBeInTheDocument();
    expect(screen.getByText('In Policy')).toBeInTheDocument();
    expect(screen.getByText('Policy context')).toBeInTheDocument();
    expect(
      screen.getByText('How this differs across disaster contexts')
    ).toBeInTheDocument();
    expect(screen.getByText('Flood')).toBeInTheDocument();
    expect(screen.getByText('Related terms')).toBeInTheDocument();
    expect(screen.getByText('Vulnerability')).toBeInTheDocument();
    expect(screen.getByText('Common misinterpretation')).toBeInTheDocument();
  });

  it('clears search with the clear action', async () => {
    const user = userEvent.setup();
    render(<GlossaryClient terms={terms} />);

    await user.type(screen.getByLabelText('Search'), 'expo');
    expect(screen.queryByText('Hazard')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'clear' }));
    expect(screen.getByText('Hazard')).toBeInTheDocument();
  });
});
