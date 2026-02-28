import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0B",
        surface: "#161616",
        border: "#262626",
        text: "#E8E8E8",
        muted: "#666666",
        accent: "#FFFFFF",
      },
    },
  },
  plugins: [],
};

export default config;
