import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { // violet, sampled from the Jagaly mark (#7B2FF7); 600 = logo purple (5.9:1 on white)
          50: '#f6f1ff', 100: '#ede3ff', 200: '#dcc8ff', 300: '#c3a0fe', 400: '#a472fb',
          500: '#8a3ffb', 600: '#7b2ff7', 700: '#6522d8', 800: '#5119b0', 900: '#3d1488', 950: '#250b55',
        },
        coral: { 50: '#fff1f3', 100: '#ffe1e6', 200: '#ffc7d1', 300: '#ff9daf', 400: '#ff7189', 500: '#ff4d6d', 600: '#e0294f', 700: '#c21f48', 800: '#9f1a3d' },
        ink: { 900: '#0b1220', 800: '#151d2e', 700: '#222c40', 600: '#3a4558', 500: '#5b6578', 400: '#8a93a3', 300: '#b9c0cc', 200: '#dde1e8', 100: '#eef0f4', 50: '#f7f8fa' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        kannada: ['var(--font-kn)', 'var(--font-dev)', 'var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,18,32,.04), 0 8px 24px -8px rgba(11,18,32,.10)',
        lift: '0 2px 4px rgba(11,18,32,.04), 0 18px 40px -12px rgba(11,18,32,.22)',
      },
    },
  },
  plugins: [],
} satisfies Config;
