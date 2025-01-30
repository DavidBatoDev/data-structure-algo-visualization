import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Cabin", "sans-serif"],
        secondary: ["Calistoga", "sans-serif"],
      },
      colors: {
        primary: "var(--primary-color)",
        "primary-light": "var(--primary-light-color)",
        secondary: "var(--secondary-color)",
        "secondary-light": "var(--secondary-light-color)",
        post: "var(--post-color)",
        y: "var(--delete-color)",
        light: "var(--light-color)",
        grey: "var(--grey-color)",
        dark: "var(--dark-color)",
        white: "var(--white-color)",
      },
      fontFamily: {
        primary: ["var(--primary-font)", "sans-serif"],
        secondary: ["var(--seconday-font)", "sans-serif"],
      },
      borderWidth: {
        DEFAULT: "var(--border-width)",
      },
      borderRadius: {
        DEFAULT: "var(--element-border-radius)",
      },
      padding: {
        element: "var(--element-padding)",
      },
      maxWidth: {
        custom: "var(--maximum-width)",
      },
      height: {
        button: "var(--button-height)",
        "small-button": "var(--small-button-height)",
      },
      spacing: {
        "button-height": "6px", // Adjust as needed
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        ":root": {
          "--primary-color": "#FFDE00",
          "--primary-light-color": "#FFE769",
          "--secondary-color": "#FFE4BA",
          "--secondary-light-color": "#FFF6E8",
          "--post-color": "#62EEA8",
          "--delete-color": "#FF9F9F",
          "--light-color": "#FFFEFC",
          "--grey-color": "#747E79",
          "--dark-color": "#000000",
          "--white-color": "#FFFEFC",
          "--primary-font": "'Cabin', sans-serif",
          "--seconday-font": "'Calistoga', sans-serif",
          "--border-width": "3px",
          "--element-border-radius": "5px",
          "--button-height": "5px",
          "--small-button-height": "2px",
          "--element-padding": "0.8em",
          "--maximum-width": "320px",
        },
      });
    }),
  ],
};
