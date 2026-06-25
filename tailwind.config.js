/** @type {import('tailwindcss').Config} */
const borderRadius = require('./styles/tokens/tailwind/border-radius');
const borderWidth = require('./styles/tokens/tailwind/border-width');
const boxShadow = require('./styles/tokens/tailwind/box-shadow');
const colors = require('./styles/tokens/tailwind/color');
const fontFamily = require('./styles/tokens/tailwind/font-family');
const fontSize = require('./styles/tokens/tailwind/font-size');
const fontWeight = require('./styles/tokens/tailwind/font-weight');
const lineHeight = require('./styles/tokens/tailwind/line-height');
const space = require('./styles/tokens/tailwind/space');
const transitionTimingFunction = require('./styles/tokens/tailwind/ease-function');
const transitionDuration = require('./styles/tokens/tailwind/duration');
const zIndex = require('./styles/tokens/tailwind/z-index');

module.exports = {
  corePlugins: {
    preflight: false,
  },
  darkMode: ['class', '[data-mode="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // ids-drr-branding is an npm `file:` dep symlinked to ./branding-stub/,
    // which in deployments is bind-mounted to the real branding package.
    // Scan it so branding-only Tailwind classes make it into the compiled CSS.
    // Real branding is copied into branding-stub for Docker builds; local
    // installs may also place the package under node_modules/ids-drr-branding.
    './branding-stub/src/**/*.{js,ts,jsx,tsx}',
    './node_modules/ids-drr-branding/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors,
    space,
    borderRadius,
    borderWidth,
    fontSize,
    lineHeight,
    boxShadow,
    zIndex,
    transitionTimingFunction,
    transitionDuration,
    fontFamily,
    fontWeight,

    animation: {
      none: 'none',
      spin: 'spin 1s linear infinite',
      ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      bounce: 'bounce 1s infinite',
    },
    aspectRatio: {
      auto: 'auto',
      square: '1 / 1',
      video: '16 / 9',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1200px',
      '2xl': '1300px',
    },
    container: {
      center: true,
      padding: '20px',
    },
  },
  plugins: [],
};
