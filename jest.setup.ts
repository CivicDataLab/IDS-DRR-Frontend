// //jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom';

// Wrap every test render in NextIntlClientProvider so components calling
// useTranslations find a context.
jest.mock('@testing-library/react', () => {
  const actual = jest.requireActual('@testing-library/react');
  const React = require('react');
  const { NextIntlClientProvider } = require('next-intl');
  const messages = require('./locales/en.json');
  return {
    ...actual,
    render: (ui: any, options?: any) =>
      actual.render(
        React.createElement(
          NextIntlClientProvider,
          { locale: 'en', messages },
          ui
        ),
        options
      ),
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock fetch globally for components using fetch in effects
if (!(global as any).fetch) {
  (global as any).fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
    })
  );
}

// Provide default env vars used in tests
process.env.NEXT_PUBLIC_BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost';
