import type { ReactElement, ReactNode } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { render as rtlRender } from '@testing-library/react/pure';
import { NextIntlClientProvider } from 'next-intl';

import { formats } from '@/i18n/formats';
import messages from '@/locales/en.json';

export type IntlRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  locale?: string;
  messages?: typeof messages;
  /** Composed inside NextIntlClientProvider (e.g. a router or query client). */
  wrapper?: React.ComponentType<{ children: ReactNode }>;
};

function IntlTestProvider({
  children,
  locale = 'en',
  intlMessages = messages,
}: {
  children: ReactNode;
  locale?: string;
  intlMessages?: typeof messages;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={intlMessages} formats={formats}>
      {children}
    </NextIntlClientProvider>
  );
}

function render(ui: ReactElement, options: IntlRenderOptions = {}) {
  const {
    locale,
    messages: intlMessages,
    wrapper: AdditionalWrapper,
    ...renderOptions
  } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => {
    const content = AdditionalWrapper ? (
      <AdditionalWrapper>{children}</AdditionalWrapper>
    ) : (
      children
    );

    return (
      <IntlTestProvider locale={locale} intlMessages={intlMessages}>
        {content}
      </IntlTestProvider>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react/pure';
export { render };
