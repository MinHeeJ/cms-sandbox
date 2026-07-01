/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', './tests/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5d87ff',
        primaryemphasis: '#4b6fd9',
        secondary: '#49beff',
        success: '#13deb9',
        warning: '#f6b51e',
        error: '#ef4444',
        info: '#8754ec',
        dark: '#1c2536',
        bodytext: '#5a6a85bf',
        border: '#dfe5ef',
        ld: '#dfe5ef',
        lightprimary: 'color-mix(in oklab, #5d87ff 12%, transparent)',
        lightsecondary: 'color-mix(in oklab, #49beff 12%, transparent)',
        lightsuccess: 'color-mix(in oklab, #13deb9 12%, transparent)',
        lightwarning: 'color-mix(in oklab, #f6b51e 12%, transparent)',
        lighterror: 'color-mix(in oklab, #ef4444 12%, transparent)',
        lightinfo: 'color-mix(in oklab, #8754ec 12%, transparent)'
      }
    }
  },
  plugins: []
};
