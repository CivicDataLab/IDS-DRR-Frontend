import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TranslateDropdown } from '@/components/langSelect/lang-select';
import { LocaleDropdown } from '@/components/langSelect/locale-select';

jest.mock('opub-ui');

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

const SCRIPT_ID = 'bhashini-translation-script';
const WIDGET_ID = 'bhashini-translation';
const SCRIPT_SRC =
  'https://translation-plugin.bhashini.co.in/v3/website_translation_utility.js';

function cleanupBhashiniDom() {
  document.getElementById(SCRIPT_ID)?.remove();
  document.getElementById(WIDGET_ID)?.remove();
  localStorage.clear();
}

describe('TranslateDropdown', () => {
  afterEach(() => {
    cleanupBhashiniDom();
  });

  it('renders the plugin container and injects the script once', () => {
    const { unmount } = render(<TranslateDropdown />);

    const container = screen.getByTestId('bhashini-plugin-container');
    expect(container).toHaveClass('bhashini-plugin-container');

    const script = document.getElementById(SCRIPT_ID) as HTMLScriptElement;
    expect(script).toBeTruthy();
    expect(script.src).toBe(SCRIPT_SRC);
    expect(script.getAttribute('page-source-language')).toBe('en');
    expect(script.getAttribute('translation-language-list')).toBe('en,hi');
    expect(script.getAttribute('language_order')).toBe('en,hi');
    expect(script.getAttribute('language-icon-color')).toBe('#ffffff');

    unmount();
    render(<TranslateDropdown />);
    expect(document.querySelectorAll(`#${SCRIPT_ID}`)).toHaveLength(1);
  });

  it('re-parents an existing widget when the nav remounts', () => {
    const { unmount } = render(<TranslateDropdown />);

    const widget = document.createElement('div');
    widget.id = WIDGET_ID;
    screen.getByTestId('bhashini-plugin-container').appendChild(widget);

    unmount();
    expect(document.body.contains(widget)).toBe(true);
    expect(widget.style.display).toBe('none');

    render(<TranslateDropdown />);
    expect(
      screen.getByTestId('bhashini-plugin-container').contains(widget)
    ).toBe(true);
    expect(widget.style.display).toBe('');
  });

  it('shows the selected language next to the Bhashini icon', async () => {
    localStorage.setItem('preferredLanguage', 'hi');
    render(<TranslateDropdown />);

    const icon = document.createElement('div');
    icon.className = 'bhashini-dropdown-btn-icon';
    const widget = document.createElement('div');
    widget.id = WIDGET_ID;
    widget.appendChild(icon);
    screen.getByTestId('bhashini-plugin-container').appendChild(widget);

    await waitFor(() => {
      expect(
        icon.querySelector('.bhashini-dropdown-btn-text')
      ).toHaveTextContent('Hindi');
    });
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
