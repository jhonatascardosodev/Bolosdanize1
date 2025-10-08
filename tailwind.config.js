export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        rosa: "#f4c6d4",
        verde: "#92b79c",
        marrom: "#4b2c2c"
      },
      fontFamily: {
        destaque: ["'Dancing Script'", "cursive"],
        texto: ["'Poppins'", "sans-serif"]
      }
    }
  },
  plugins: [],
}
