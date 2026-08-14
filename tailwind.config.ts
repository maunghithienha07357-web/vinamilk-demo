import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e293b",
        accent: "#3b82f6",
        surface: "#f8fafc",
        border: "#e2e8f0",
        "brand-leaf": "#2E933C",
        "brand-leaf-hover": "#247a32",
        "brand-leaf-soft": "#e8f4ea",
        "brand-leaf-softer": "#f2faf3",
        "brand-leaf-border": "#bddcc4",
        "brand-leaf-border-strong": "#8fc99a",
        "brand-leaf-text": "#1f5c2a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Be Vietnam Pro", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover":
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
