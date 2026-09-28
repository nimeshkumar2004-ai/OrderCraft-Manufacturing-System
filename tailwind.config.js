/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dce5f0',
          200: '#b9cde2',
          300: '#8baecd',
          400: '#5c8db4',
          500: '#3e709a',
          600: '#2f577e',
          700: '#274767',
          800: '#1b324b',
          900: '#0f1f33',
          950: '#0a1424',
        },
        brand: {
          orange: '#f97316',
          'orange-hover': '#ea580c',
          'orange-light': '#ffedd5',
          navy: '#0f172a',
          'navy-light': '#1e293b',
          'navy-dark': '#0a0f1d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
