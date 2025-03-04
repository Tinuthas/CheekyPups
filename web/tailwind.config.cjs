/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
  content: [
    './src/**/*.tsx',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        pinkBackground: '#f02a77',
        blue: '#7dcce9'
      },
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))'
      },
      screens: {
        'desktop': '1440px',
        // => @media (min-width: 1440px) { ... }
      },
      fontFamily: {
        cursed: ['Itim', 'sans-serif'],
        borsok: ['Borsok', "sans-serif"],
      },
    },
    fontFamily: {
      cursed: ['Itim', 'sans-serif']
    },
    backgroundImage: {
      'blue-background': "url('/BlueBackground.png')",
      'mobile-background': "url('/MobileBackground.png')",
    },
    textShadow: {
      sm: '0 1px 2px var(--tw-shadow-color)',
      DEFAULT: '0 2px 4px var(--tw-shadow-color)',
      lg: '0 8px 16px var(--tw-shadow-color)',
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}
