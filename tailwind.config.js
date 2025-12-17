/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        primaryColor:'#396c5b',
        secondaryColor:'#354a43',
        ValueProposition:'#5d847b',
        foreground:'#0d261e',
        mutedground:'#6c9f94',
        mute:'#f6f5f2'
      }
    },
  },
  plugins: [],
}