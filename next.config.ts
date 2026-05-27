import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['opub-ui', 'ids-drr-branding'],
  // Dependencies of @sentry/node, to avoid "Critical dependency: the request of a dependency is an expression".
  serverExternalPackages: ['@prisma/instrumentation', '@fastify/otel'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.csv$/,
      type: 'asset/source',
      include: /node_modules\/ids-drr-branding/,
    });
    return config;
  },
};

const wrappedConfig = withNextIntl(nextConfig);

export default process.env.NEXT_PUBLIC_SENTRY_DSN_URL
  ? withSentryConfig(wrappedConfig, {
      org: process.env.SENTRY_ORG_NAME,
      project: process.env.SENTRY_PROJECT_NAME,
      sentryUrl: process.env.SENTRY_URL,
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#apply-instrumentation-to-your-app
      silent: !process.env.CI,
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#source-maps-optional
      widenClientFileUpload: !!process.env.SENTRY_AUTH_TOKEN,
      webpack: {
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/tree-shaking/
        treeshake: {
          removeDebugLogging: true,
        },
      },
    })
  : wrappedConfig;
