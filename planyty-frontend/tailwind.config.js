/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FDF7E4',
        secondary: '#FAEED1',
        accent: '#DED0B6',
        dark: '#BBAB8C',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}