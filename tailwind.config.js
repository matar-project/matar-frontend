/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand primary: deep navy blue (#1A2E6E)
        primary: {
          50:  '#EFF3FF',
          100: '#DEE7FF',
          200: '#BCCEFF',
          300: '#85A4F5',
          400: '#4D6FE0',
          500: '#2B4DC0',
          600: '#1A2E6E',
          700: '#152464',
          800: '#0F1A4A',
          900: '#0A1236',
        },
        // Brand secondary: teal (#00A0B8) from logo bars
        secondary: {
          50:  '#E6F9FB',
          100: '#CCF3F7',
          200: '#99E7EF',
          300: '#4DD3E2',
          400: '#00BFCF',
          500: '#00A0B8',
          600: '#008898',
          700: '#006B7A',
          800: '#004F5E',
          900: '#003540',
        },
        // Full Matar 15-color accent palette (from logo bar marks)
        matar: {
          red:       '#D42B2B',
          orangeRed: '#D45020',
          amber:     '#E8A020',
          orange:    '#D07020',
          darkGreen: '#1A7840',
          green:     '#28A855',
          teal:      '#00A0B8',
          navy:      '#1A2E6E',
          tealGreen: '#008888',
          blue:      '#1A3070',
          purple:    '#6030A0',
          lavender:  '#9070C0',
          hotPink:   '#C82868',
          pinkRed:   '#E03060',
          darkRed:   '#C02028',
        },
      },
      fontFamily: {
        arabic: ['"Noto Kufi Arabic"', '"Segoe UI"', 'Tahoma', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

