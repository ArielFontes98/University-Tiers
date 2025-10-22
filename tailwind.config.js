/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#820AD1',
        'primary-dark': '#6A08AD',
        'primary-light': '#9B2FE0',
      },
    },
  },
  plugins: [],
}
