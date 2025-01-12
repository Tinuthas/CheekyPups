/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        pinkBackground: '#FF499E'
      },
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))'
      },
      screens: {
        'desktop': '1440px',
        // => @media (min-width: 1440px) { ... }
      },
      fontFamily: {
        cursed: ['Itim', 'sans-serif']
      },
    },
    fontFamily: {
      cursed: ['Itim', 'sans-serif']
    }
  },
  plugins: [],
}
