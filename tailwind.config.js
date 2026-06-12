/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
      },
      colors: {
        cyan: {
          400: 'rgb(var(--cyan-400) / <alpha-value>)',
          500: 'rgb(var(--cyan-500) / <alpha-value>)',
        },
        fuchsia: {
          400: 'rgb(var(--fuchsia-400) / <alpha-value>)',
          500: 'rgb(var(--fuchsia-500) / <alpha-value>)',
        }
      },
    },
  },
  plugins: [],
}
