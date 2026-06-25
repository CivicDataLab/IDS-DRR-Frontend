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
      // The ids-drr-branding package is consumed as `file:./branding-stub`,
      // which npm symlinks into node_modules. Webpack resolves symlinks before
      // matching `include`, so the CSV path depends on the install mode:
      // - `node_modules/ids-drr-branding/` (e.g. npm --install-links or a registry install)
      // - `branding-stub/` (e.g. Docker runtime bind-mount or build-time copy)
      // - `../ids-drr-<name>-branding/` (e.g. manual symlink to conventional name)
      include: [
        /node_modules\/ids-drr-branding/,
        /branding-stub/,
        /ids-drr-[a-z-]+-branding/,
      ],
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
