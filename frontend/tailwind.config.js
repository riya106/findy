/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        mint: {
          50:  '#f0fdf8',
          100: '#ccfbec',
          200: '#99f5d9',
          300: '#5ee8c0',
          400: '#2dd4aa',
          500: '#0fb892',
          600: '#059272',
          700: '#06735a',
          800: '#085b48',
          900: '#074b3c',
        },
      },
    },
  },
  plugins: [],
}