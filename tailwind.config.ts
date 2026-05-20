import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#1A1D2E',
          text: '#A0A3B1',
          active: '#6C5CE7',
          activeBg: 'rgba(108, 92, 231, 0.15)',
          border: 'rgba(255,255,255,0.06)',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F9FC',
          card: '#FFFFFF',
        },
        accent: {
          purple: '#6C5CE7',
          green: '#00B894',
          orange: '#FDCB6E',
          red: '#FF7675',
          blue: '#0984E3',
        },
        muted: '#6B7280',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.10)',
        sidebar: '2px 0 16px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'sidebar-collapse': 'sidebar-collapse 300ms ease-in-out',
      },
      keyframes: {
        'sidebar-collapse': {
          '0%': { width: '16rem' },
          '100%': { width: '4rem' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
