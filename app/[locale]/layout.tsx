import React from 'react';
import { Inter as FontSans } from 'next/font/google';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';

import { Footer } from '@/config/branding';
import { formats } from '@/i18n/formats';
import {
  appleIcon,
  favicon,
  locales,
  openGraphImage,
  siteUrl,
} from '@/config/site';
import { getPrefLangCookie } from '@/lib/serverUtils';
import { MainNav } from '@/components/main-nav';
import { MediaRendering } from '@/components/media-rendering';
import { MobileNav } from '@/components/mobile-nav';
import Provider from '@/components/provider';

const fontSans = FontSans({ subsets: ['latin'], display: 'swap' });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  const name = t('name');
  const description = t('description');
  const creator = t('creator');
  const creatorUrl = t('creatorUrl');
  return {
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    keywords: t('keywords').split(',').map((k) => k.trim()),
    authors: [{ name: creator, url: creatorUrl }],
    creator,
    ...(siteUrl && {
      metadataBase: new URL(siteUrl),
      openGraph: {
        type: 'website',
        locale: t('ogLocale'),
        url: siteUrl,
        title: name,
        description,
        siteName: name,
        ...(openGraphImage && { images: [openGraphImage] }),
      },
      twitter: {
        card: 'summary_large_image',
        title: name,
        description,
        creator,
        ...(openGraphImage && { images: [openGraphImage] }),
      },
    }),
    icons: {
      ...(favicon && { icon: favicon }),
      ...(appleIcon && { apple: appleIcon }),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  setRequestLocale(locale);
  const messages = await getMessages();

  // Get the language preference from cookies
  const prefLangCookie = await getPrefLangCookie();

  return (
    <html lang={locale}>
      <head>
        {process.env.NEXT_PUBLIC_HOTJAR_ID && (
          <Script id="hotjar" strategy="afterInteractive">
            {`
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `}
          </Script>
        )}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_APP_ID && (
          <>
            <Script id="googleAnalytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_APP_ID}');
              `}
            </Script>
            <Script
              id="googleAnalyticsTag"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_APP_ID}`}
            />
          </>
        )}
      </head>
      <body className={fontSans.className}>
        <NextIntlClientProvider locale={locale} messages={messages} formats={formats}>
          <Provider locale={locale}>
            <div className="min-h-screen flex flex-col">
              <MediaRendering minWidth={null} maxWidth="1023">
                <MobileNav prefLangCookie={prefLangCookie} />
              </MediaRendering>
              <MediaRendering minWidth="1024" maxWidth={null}>
                <MainNav prefLangCookie={prefLangCookie} />
              </MediaRendering>

              <main className="flex-1">{children}</main>

              {Footer && (
                <MediaRendering minWidth="1024" maxWidth={null}>
                  <Footer />
                </MediaRendering>
              )}
            </div>
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
