// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Roboto Condensed"', 'sans-serif'],
        special: ['"Special Elite"', 'cursive'],
      },
      colors: { 
        'brand-blue': '#3786ff',
        'brand-blue-dark': '#567bb2', 
        'brand-text-gray': '#cfcfcf', 
        'brand-bg-dark': '#0c0a0a',   
        'brand-bg-black': '#000000',  
        'brand-gray-light': '#848484',
        'brand-border-gray': '#302f2f',
        'brand-item-bg': '#1b1a1a',
      },
      animation: {
        'slide-in-bottom': 'slideInBottom 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUpKEY 0.7s ease-out forwards',
        'flip-y': 'flip-y 0.6s ease-in-out forwards',
      },
      keyframes: {
        slideInBottom: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUpKEY: { // ИСПОЛЬЗУЕМ УНИКАЛЬНОЕ НАЗВАНИЕ
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'flip-y': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.animation-delay-200': { 'animation-delay': '0.2s' },
        '.animation-delay-300': { 'animation-delay': '0.3s' }, // Если используется где-то еще
        '.animation-delay-400': { 'animation-delay': '0.4s' },
        '.animation-delay-600': { 'animation-delay': '0.6s' }, // Если используется где-то еще
        '.animation-delay-900': { 'animation-delay': '0.9s' }, // Если используется где-то еще
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}