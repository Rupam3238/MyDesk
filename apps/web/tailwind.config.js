/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f0f11',
          bg2: '#161618',
          surface: '#1c1c1f',
          surface2: '#242428',
          border: 'rgba(255,255,255,0.07)',
        },
      },
    },
  },
  plugins: [],
}
