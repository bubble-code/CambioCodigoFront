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
        'so-gray': '#bbbcbdff',
        'so-bg': '#f8f9f9',
        // === Tema iOS — soft light ===
        'app-bg': '#F2F2F7',
        'app-surface': '#FFFFFF',
        'app-accent': '#007AFF',
        'app-accent-light': '#339AF0',
        'app-text': '#1C1C1E',
        'app-muted': '#8E8E93',
        'app-border': 'rgba(60,60,67,0.18)',
      },
    },
  },
  plugins: [],
}