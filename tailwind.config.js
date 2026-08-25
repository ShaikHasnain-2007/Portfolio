/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["BubbledotICG-FinePos", "Doto", "Pixelify Sans", "Silkscreen", "monospace"],
        dot: ["Doto", "BubbledotICG-FinePos", "Pixelify Sans", "monospace"],
        display: ["BubbledotICG-FinePos", "Doto", "Space Grotesk", "Syne", "sans-serif"],
        syne: ["Syne", "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
        serif: ["Cormorant Garamond", "serif"],
        mono: ["Space Mono", "monospace"],
        grotesk: ["Space Grotesk", "sans-serif"],
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
      animation: {
        marquee: 'marquee 25s linear infinite',
      }
    },
  },
  plugins: [],
}
