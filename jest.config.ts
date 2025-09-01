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
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/$1',
    // Mock opub-ui components
    '^opub-ui$': '<rootDir>/tests/__mocks__/opub-ui.tsx',
    '^opub-ui/viz$': '<rootDir>/tests/__mocks__/opub-ui.tsx',
    // Mock d3 modules
    '^d3-scale$': '<rootDir>/tests/__mocks__/d3-scale.ts',
    '^d3-scale-chromatic$': '<rootDir>/tests/__mocks__/d3-scale-chromatic.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(d3-scale|d3-array|d3-color|d3-format|d3-interpolate|d3-time|d3-time-format|d3-timer|d3-transition|d3-zoom|d3-drag|d3-dispatch|d3-ease|d3-selection|d3-shape|d3-path|d3-polygon|d3-quadtree|d3-random|d3-sankey|d3-force|d3-hierarchy|d3-chord|d3-contour|d3-delaunay|d3-geo|d3-geo-projection|d3-hexbin|d3-histogram|d3-scale-chromatic|d3-symbol|d3-threshold|d3-tile|d3-treemap|d3-voronoi|d3-zoom)/)',
  ],
  collectCoverage: false,
  // collectCoverageFrom: [
  //   'app/**/*.{js,jsx,ts,tsx}',
  //   'src/**/*.{js,jsx,ts,tsx}',
  //   '!**/*.d.ts',
  //   '!**/node_modules/**',
  //   '!**/vendor/**',
  // ],
  // coverageDirectory: 'coverage',
  // coveragePathIgnorePatterns: [
  //   '/node_modules/',
  //   '/coverage',
  //   'package.json',
  //   'package-lock.json',
  //   'reportWebVitals.ts',
  //   'setup.ts',
  //   'index.tsx',
  // ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
