import { DatasetCatalog } from '@/app/[locale]/components/dataset-catalog';
import { render } from '@testing-library/react';

jest.mock('opub-ui');

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img alt={props.alt} />,
}));

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(async (namespace: string) => {
    return (key: string) => `${namespace}.${key}`;
  }),
}));

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

describe('DatasetCatalog', () => {
  it('renders dataset category cards', async () => {
    const section = await DatasetCatalog();
    const { container } = render(section);

    expect(container.textContent).toContain('home.datasets.heading');
    expect(container.textContent).toContain('factors.hazard.name');
    expect(container.querySelector('a[href="/datasets?categories=Hazard"]')).toBeTruthy();
  });
});
