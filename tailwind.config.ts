import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — flip with the .dark class (see globals.css).
        page: "rgb(var(--c-page) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        raised: "rgb(var(--c-raised) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        bodytext: "rgb(var(--c-body) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        // Deep forest green — primary brand
        forest: {
          50: "#eef6ef",
          100: "#d6e9d8",
          200: "#aed3b3",
          300: "#7fb787",
          400: "#4f955a",
          500: "#2f7539",
          600: "#1f5c2b",
          700: "#194a24",
          800: "#153c1f",
          900: "#0f2d18",
        },
        // Warm terracotta / saffron accent
        saffron: {
          50: "#fdf3ec",
          100: "#f9e0cd",
          200: "#f2be9c",
          300: "#e99866",
          400: "#e07a3e",
          500: "#d1622a",
          600: "#b34c20",
          700: "#8f3c1e",
          800: "#6f321d",
          900: "#5a2b1b",
        },
        cream: "#faf7f1",
        charcoal: "#22201c",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 45, 24, 0.04), 0 8px 24px rgba(15, 45, 24, 0.08)",
        "card-hover": "0 2px 4px rgba(15, 45, 24, 0.06), 0 16px 40px rgba(15, 45, 24, 0.14)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
