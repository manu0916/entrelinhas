/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F8F4EB',
        reading: '#FFFFFF',
        ink: {
          DEFAULT: '#202B33',
          muted: '#5A6B75',
          light: '#8898A1'
        },
        pine: {
          DEFAULT: '#245B57',
          hover: '#1B4542',
          light: '#E8F1EF'
        },
        terracotta: {
          DEFAULT: '#C97552',
          hover: '#B36342',
          light: '#FAECE7'
        },
        amber: {
          marker: '#EAC568',
          light: '#FDF7E7'
        },
        border: {
          subtle: '#EAE3D2',
          reading: '#E2DBD0'
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'editorial': '0 4px 20px -2px rgba(32, 43, 51, 0.05), 0 2px 6px -1px rgba(32, 43, 51, 0.03)',
        'editorial-hover': '0 12px 30px -4px rgba(32, 43, 51, 0.09), 0 4px 12px -2px rgba(32, 43, 51, 0.04)',
        'modal': '0 20px 50px -10px rgba(32, 43, 51, 0.2)',
      }
    },
  },
  plugins: [],
};
