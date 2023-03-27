const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const { violet } = require("@radix-ui/colors");

module.exports = {
  mode: "jit",
  content: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        ...violet,
        "gray-1000": "#050505",
        gray: colors.neutral,
      },
    },
    fontFamily: {
      sans: ["Inter", ...fontFamily.sans],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
