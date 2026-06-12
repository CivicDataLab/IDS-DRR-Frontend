/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import nextJest from 'next/jest.js';
import type { Config } from 'jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Intl-aware render; imports from @testing-library/react/pure internally.
    '^@testing-library/react$': '<rootDir>/tests/test-utils.tsx',
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/$1',
    // Mock opub-ui components
    '^opub-ui$': '<rootDir>/tests/__mocks__/opub-ui.tsx',
    '^opub-ui/viz$': '<rootDir>/tests/__mocks__/opub-ui.tsx',
    // Mock d3 modules
    '^d3-scale$': '<rootDir>/tests/__mocks__/d3-scale.ts',
    '^d3-scale-chromatic$': '<rootDir>/tests/__mocks__/d3-scale-chromatic.ts',
    '\\.csv$': '<rootDir>/tests/__mocks__/csv.ts',
  },
  collectCoverageFrom: [
    '{app,components,config,hooks,i18n,lib}/**/*.{ts,tsx}',
  ],
  coverageReporters: ['text', 'lcov'],
  modulePathIgnorePatterns: ['<rootDir>/.next/standalone/'],
};

// https://next-intl.dev/docs/environments/testing#jest
export default async () => ({
  ...(await createJestConfig(config)()),
  transformIgnorePatterns: [
    '/node_modules/(?!(ids-drr-branding|next-intl|use-intl|@formatjs|icu-minify|intl-messageformat)/)',
  ],
});
