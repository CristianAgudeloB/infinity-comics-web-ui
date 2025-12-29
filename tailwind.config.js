/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d10",
        surface: "#151821",
        surfaceHover: "#1c2030",
        primary: "#7c7cff",
        text: "#e5e7eb",
        muted: "#9ca3af"
      }
    }
  },
  plugins: []
};
