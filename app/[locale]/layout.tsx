import React from 'react';
import { Inter as FontSans } from 'next/font/google';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { captureException } from '@sentry/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

import { mainConfig, siteConfig } from '@/config/site';
import { getPrefLangCookie } from '@/lib/serverUtils';
import { MainNav } from '@/components/main-nav';
import { MediaRendering } from '@/components/media-rendering';
import { MobileNav } from '@/components/mobile-nav';
import Provider from '@/components/provider';
import locales from '../../config/locales';

const fontSans = FontSans({ subsets: ['latin'], display: 'swap' });

export function generateStaticParams() {
  return locales.all.map((locale) => ({ locale }));
}

export async function generateMetadata() {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ['Climate Actions', 'Assam', 'DRR', 'Disaster', 'Risk Score'],
    authors: [
      {
        name: 'CivicDataLab',
        url: 'https://civicdatalab.in/',
      },
    ],
    creator: 'CivicDataLab',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [`${siteConfig.url}/og.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [`${siteConfig.url}/og.png`],
      creator: 'CivicDataLab',
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: `${siteConfig.url}/apple-touch-icon.png`,
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  let locale = (await params).locale;
  const { Footer } = await import('ids-drr-branding');
  let messages;
  try {
    messages = (await import(`../../locales/${locale}.json`)).default;
  } catch (error) {
    captureException(error);
    notFound();
  }
  unstable_setRequestLocale(locale);

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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Provider>
            <MediaRendering minWidth={null} maxWidth="1023">
              <MobileNav data={mainConfig} />
            </MediaRendering>
            <MediaRendering minWidth="1024" maxWidth={null}>
              <MainNav data={mainConfig} prefLangCookie={prefLangCookie} />
            </MediaRendering>

            {children}

            {Footer && (
              <MediaRendering minWidth="1024" maxWidth={null}>
                <Footer />
              </MediaRendering>
            )}
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
