/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yanama: {
          dark: '#1D1D1D',        // Main application background
          black: '#000000',       // Sidebar background
          card: '#4C4643',        // Dashboard cards
          light: '#F0EFED',       // Main text / Warm white
          ivory: '#F9F8F3',       // Soft ivory report bg
          sage: '#A5A78F',        // Secondary text / Accent elements
          cardhover: '#59524e',
          border: '#3A3634',
          accent: '#A5A78F'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
