/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: 'jit',
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007233', // Elnaizak green
        secondary: '#ffffff', // white for text or backgrounds
        dark: '#1a1a1a',
      },
    },
  },
  plugins: [],
}

