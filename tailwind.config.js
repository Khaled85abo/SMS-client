/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector", // Use class-based dark mode.
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Specify content paths for Tailwind to purge unused styles in production.
  theme: {
    extend: {
      // Extend the default Tailwind boxShadow utility.
      boxShadow: {
        converter: "rgba(35, 55, 80, 0.3) 0px 6px 12px",
      },
      // Extend the default Tailwind color palette.
      colors: {
        header_bg: "#0A146D",
        "theme-primary-text-color": "var(--text-primary-color)",
        "theme-primary-bg": "var(--bg-primary-color)",
        "theme-btn-primary-bg-color": "var(--btn-primary-bg-color)",
        zalandoOrange: "#ff6900",
        fastApiGrey: "#4E4F50",
        antiqueWhite: "#F4F1DE",
        terraCotta: "#B85042",
        mutedTeal: "#A7BEAE",
        mutedTealLight: "#b8d4c1",
        deepBlue: "#3D405B",
      },
      // Extend the default Tailwind fontFamily utility.
      fontFamily: {
        best: ["DM Serif Display", "serif"], // Define a custom fontFamily.
      },
    },
  },
  plugins: [], // Define any Tailwind CSS plugins here.
};
