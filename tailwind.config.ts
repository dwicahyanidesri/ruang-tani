import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          50: '#eefdf5',
          100: '#d6f9e4',
          200: '#aef2cc',
          300: '#76e4ac',
          400: '#3ecd8a',
          500: '#18b06e',
          600: '#0e8f5a',
          700: '#0d724b',
          800: '#0e5a3d',
          900: '#0d4a34',
        },
        ink: {
          900: '#0f172a',
        },
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(15, 23, 42, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
