import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef7f3', 100: '#d5ede2', 200: '#acdbc6', 300: '#7bc3a5', 400: '#4aa682',
          500: '#2a8a67', 600: '#1d6f53', 700: '#185944', 800: '#154738', 900: '#0f3329', 950: '#08201a',
        },
        saffron: { 50: '#fff8ed', 100: '#ffefd3', 200: '#ffdba5', 300: '#ffc06d', 400: '#ff9b32', 500: '#fe7f0b', 600: '#ef6301', 700: '#c64a04' },
        ink: { 900: '#0b1220', 800: '#151d2e', 700: '#222c40', 600: '#3a4558', 500: '#5b6578', 400: '#8a93a3', 300: '#b9c0cc', 200: '#dde1e8', 100: '#eef0f4', 50: '#f7f8fa' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,18,32,.04), 0 8px 24px -8px rgba(11,18,32,.10)',
        lift: '0 2px 4px rgba(11,18,32,.04), 0 18px 40px -12px rgba(11,18,32,.22)',
      },
    },
  },
  plugins: [],
} satisfies Config;
