/** @type {import('next').NextConfig} */
const { execSync } = require('child_process');
const withNextIntl = require('next-intl/plugin')();
const path = require('path');
const nextConfig = {
  transpilePackages: ['opub-ui'],
};

execSync(`node ${path.resolve(__dirname, './scripts/generateConfig.js')}`);

module.exports = withNextIntl(nextConfig);
