import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { defaultLocale, locales } from './config/site';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
});

const STATIC_SEGMENTS = new Set([
  'datasets',
  'about-us',
  'glossary',
  'api',
  ...locales,
]);

/** Redirect `/[state]/analytics` URLs to the state hub. */
function AnalyticsModuleRedirect(request: NextRequest): NextResponse | null {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  if (segments.length < 2) return null;

  const hasLocalePrefix = locales.includes(segments[0]);
  const stateIndex = hasLocalePrefix ? 1 : 0;
  const analyticsIndex = stateIndex + 1;

  if (segments[analyticsIndex] !== 'analytics') return null;

  const stateSlug = segments[stateIndex];
  if (!stateSlug || STATIC_SEGMENTS.has(stateSlug)) return null;

  const url = request.nextUrl.clone();
  url.pathname = hasLocalePrefix
    ? `/${segments[0]}/${stateSlug}`
    : `/${stateSlug}`;
  return NextResponse.redirect(url);
}

export default function middleware(request: NextRequest) {
  const redirect = AnalyticsModuleRedirect(request);
  if (redirect) return redirect;
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
