/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        srk: {
          gold: '#e1ba73',
          bronze: '#b68938',
          dark: '#0a0705',
        },
      },
      backgroundImage: {
        'srk-gradient': 'linear-gradient(135deg, #e1ba73 0%, #b68938 100%)',
        'srk-mesh': 'radial-gradient(circle at 50% 50%, rgba(182, 137, 56, 0.15), transparent 50%)',
      },
      animation: {
        gradient: 'gradient 3s ease infinite',
        'gradient-slow': 'gradient 6s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
