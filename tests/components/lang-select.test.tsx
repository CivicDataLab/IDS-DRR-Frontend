import { LocaleDropdown } from '@/components/langSelect/locale-select';
import { TranslateDropdown } from '@/components/langSelect/lang-select';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('opub-ui');

jest.mock('next/script', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@/config/site', () => ({
  languages: [
    { label: 'English', value: 'en' },
    { label: 'Hindi', value: 'hi' },
  ],
  locales: ['en', 'hi'],
}));

const replaceMock = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/datasets',
}));

jest.mock('next-intl', () => ({
  ...jest.requireActual('next-intl'),
  useLocale: () => 'en',
}));

describe('TranslateDropdown', () => {
  it('initializes from the language cookie and changes language', async () => {
    const user = userEvent.setup();

    render(<TranslateDropdown prefLangCookie="/en/hi" />);

    expect(await screen.findByDisplayValue('Hindi')).toBeInTheDocument();

    await user.selectOptions(screen.getByTestId('lang-select'), 'en');
    expect(screen.getByTestId('lang-select')).toHaveValue('en');
  });
});

describe('LocaleDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('switches locale via the router', async () => {
    const user = userEvent.setup();
    render(<LocaleDropdown />);

    await user.selectOptions(screen.getByTestId('locale-select'), 'hi');
    expect(replaceMock).toHaveBeenCalledWith('/datasets', { locale: 'hi' });
  });
});
