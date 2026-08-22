import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Coinbase Design System Colors (DESIGN.md)
        primary: {
          DEFAULT: "#0052ff",
          hover: "#003ecc",
          active: "#003ecc",
          disabled: "#a8b8cc",
        },
        ink: {
          DEFAULT: "#0a0b0d",
          strong: "#0a0b0d",
        },
        body: {
          DEFAULT: "#5b616e",
          strong: "#0a0b0d",
        },
        muted: {
          DEFAULT: "#7c828a",
          soft: "#a8acb3",
        },
        hairline: {
          DEFAULT: "#dee1e6",
          soft: "#eef0f3",
        },
        canvas: {
          DEFAULT: "#ffffff",
          soft: "#f7f7f7",
        },
        surface: {
          soft: "#f7f7f7",
          card: "#ffffff",
          strong: "#eef0f3",
          dark: "#0a0b0d",
          "dark-elevated": "#16181c",
          // Backward-compatible surface scale mapped to Coinbase levels
          1: "#ffffff",
          2: "#f7f7f7",
          3: "#eef0f3",
          4: "#dee1e6",
        },
        semantic: {
          up: "#05b169",
          down: "#cf202f",
          success: "#05b169",
          danger: "#cf202f",
          yellow: "#f4b000",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "SF Pro Display",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "Consolas", "monospace"],
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        xxl: "32px",
        pill: "100px",
        full: "9999px",
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0, 0, 0, 0.04)",
        card: "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        elevated: "0 12px 32px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
