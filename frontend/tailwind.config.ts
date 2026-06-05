import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF7F1",
        sage: "#7C9A82",
        forest: "#4F6F52",
        ink: "#22332A",
        blush: "#D8A39B",
        gold: "#C7A35B",
        danger: "#B42318",
      },
      fontFamily: {
        arabic: ["var(--font-cairo)", "Cairo", "Tajawal", "sans-serif"],
        latin: ["var(--font-cairo)", "Cairo", "Inter", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      maxWidth: {
        site: "1200px",
      },
      animation: {
        "countdown-shrink": "countdown-shrink linear forwards",
      },
      keyframes: {
        "countdown-shrink": {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
