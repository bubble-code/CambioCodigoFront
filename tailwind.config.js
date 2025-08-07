/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: [
        'apple-systemBlinkMacSystemFont',
        'Segoe UI Adjusted', 'Segoe UI', 'Liberation Sans', 'sans-serif'
      ],
      mono: [
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
    extend: {
      colors: {
        'so-gray': '#24292e', // Color de texto similar a Stack Overflow
        'so-bg': '#f8f9f9', // Fondo similar
      },
      backgroundImage: {
        'favram': "url('src/assets/favram01.jpg')"
      },
    },
  },
  plugins: [],
}