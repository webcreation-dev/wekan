/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors (matching the app screenshots)
        dark: {
          bg: '#0d1b2a',
          card: '#1a2535',
          surface: '#1e2d3d',
          border: '#2a3a4d',
          input: '#1e2d3d',
        },
        // Light theme colors
        light: {
          bg: '#f0f4f8',
          card: '#ffffff',
          surface: '#f8fafc',
          border: '#e2e8f0',
          input: '#ffffff',
        },
        brand: {
          blue: '#2d7ff9',
          'blue-dark': '#1a6ce8',
          'blue-light': '#4d9aff',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        mobile: '430px',
      },
      screens: {
        mobile: '430px',
      },
    },
  },
  plugins: [],
}
