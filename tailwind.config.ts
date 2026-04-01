import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          primary: '#1A73E8',
          dark: '#0D47A1',
          light: '#E8F0FE',
        },
        red: {
          accent: '#E53935',
          hover: '#C62828',
        },
        grey: {
          light: '#F5F5F5',
          border: '#E0E0E0',
        },
        text: {
          dark: '#1A1A2E',
          muted: '#6B7280',
        },
        green: {
          pass: '#2E7D32',
          'pass-bg': '#E8F5E9',
        },
        'red-fail-bg': '#FFEBEE',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(26, 115, 232, 0.12)',
        hover: '0 8px 32px rgba(26, 115, 232, 0.2)',
      }
    },
  },
  plugins: [],
};
export default config;
