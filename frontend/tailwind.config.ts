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
        pharmacy: "#1F4F3A",
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
        "fade-up": "fade-up 0.7s ease-out both",
        "scale-in": "scale-in 0.5s ease-out both",
        "float": "float 4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
      keyframes: {
        "countdown-shrink": {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(31, 79, 58, 0.3)" },
          "50%": { boxShadow: "0 0 20px 5px rgba(31, 79, 58, 0.1)" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
