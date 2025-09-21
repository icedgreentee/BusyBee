/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bee-yellow': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        'honey-white': {
          50: '#fefdfb',
          100: '#fefbf3',
          200: '#fdf6e3',
          300: '#fcecc7',
          400: '#f9d71c',
          500: '#f4d03f',
          600: '#d4ac0d',
          700: '#b7950b',
          800: '#9a7d0a',
          900: '#7d6608',
        },
        'hex-black': {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#000000',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'hex-float': 'hex-float 6s ease-in-out infinite',
      },
      keyframes: {
        'hex-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(5deg)' },
        }
      },
      backgroundImage: {
        'hex-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23fef08a\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M30 0l15 8.66v17.32L30 34.64 15 25.98V8.66L30 0zM0 17.32l15-8.66 15 8.66v17.32L15 34.64 0 25.98V17.32zM0 42.68l15-8.66 15 8.66v17.32L15 60 0 51.34V42.68zM30 60l15-8.66V34.02L30 25.36 15 34.02v17.32L30 60z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
