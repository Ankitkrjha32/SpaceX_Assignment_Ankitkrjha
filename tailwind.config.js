/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'spacex-dark': '#2c2923',
        'spacex-blue': '#d4a574',
        'spacex-cream': '#f5f2e8',
        'spacex-accent': '#e6d5b7',
        spacex: {
          50: '#fdfcf7',
          100: '#f5f2e8',
          200: '#e6d5b7',
          300: '#d4a574',
          400: '#c08552',
          500: '#a66d3a',
          600: '#8b5a2f',
          700: '#6d4623',
          800: '#4a3118',
          900: '#2c2923',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdfcf7',
          200: '#faf7f0',
          300: '#f5f2e8',
          400: '#efeadb',
          500: '#e6d5b7',
          600: '#d4c4a0',
          700: '#b8a284',
          800: '#9c8367',
          900: '#7a6650',
        },
      },
      animation: {
        'rocket-float': 'rocket-float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'rocket-float': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)' 
          },
          '50%': { 
            transform: 'translateY(-10px) rotate(5deg)' 
          },
        }
      }
    },
  },
  plugins: [],
}

