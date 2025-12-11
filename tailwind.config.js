/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        hud: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        slate: {
          850: '#1e293b', // Custom dark shade from your original design
          900: '#0f172a',
          950: '#020617',
        }
      }
    },
  },
  plugins: [],
}