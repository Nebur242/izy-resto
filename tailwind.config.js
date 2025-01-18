/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [
    function ({ addComponents, addBase, theme }) {
      addBase({
        ':root': {
          fontSize: theme('fontSize.base'),
          '@screen 2xl': {
            fontSize: '1vw',
          },
        },

        button: {
          outline: 'none',
        },
        img: {
          userSelect: 'none',
        },
      });
      addComponents({
        '.container': {
          maxWidth: '64rem',
          marginRight: 'auto',
          marginLeft: 'auto',
          paddingRight: '1rem',
          paddingLeft: '1rem',
          '@screen xl': {
            paddingRight: '0rem',
            paddingLeft: '0rem',
          },
        },
      });
    },
    require('@tailwindcss/line-clamp'),
  ],
};
