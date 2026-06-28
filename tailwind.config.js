/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      colors: {
        surface: '#1a1b2e',
        card: '#16213e',
        border: '#0f3460',
        accent: '#e94560',
        win: '#1e6fc7',
        lose: '#c73434',
      },
    },
  },
}
