/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aqiGood: '#10b981',
        aqiSatisfactory: '#84cc16',
        aqiModerate: '#eab308',
        aqiPoor: '#f97316',
        aqiVeryPoor: '#ef4444',
        aqiSevere: '#881337',
      }
    },
  },
  plugins: [],
}
