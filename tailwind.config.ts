import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        latte: {
          50: "#fdfbf7",
          100: "#f5f1e8",
          200: "#e8dfd0",
          300: "#d4c4b0",
          400: "#a89a87",
          500: "#8d7b68",
          600: "#7a6a59",
        },
        mocha: {
          accent: "#d4a574",
          light: "#e6b887",
        },
      },
    },
  },
  plugins: [],
};

export default config;
