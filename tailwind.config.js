// tailwind.config.js
module.exports = {
    purge: false,
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {},
    },
    variants: {
      extend: {
        backgroundColor: ['active']
      },
    },
    plugins: [],
  }