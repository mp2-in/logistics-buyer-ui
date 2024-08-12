/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"Ubuntu"', 'sans-serif']
    },
    extend: {
      boxShadow: {
        '3xl': '0 1px 3px #666'
      }
    }
  },
  plugins: [],
}

