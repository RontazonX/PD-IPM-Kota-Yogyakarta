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
        ipm: {
          blue: "#0d57a0",
          "blue-hover": "#09447e",
          "blue-deep": "#083765",
          "blue-badge": "#0d57a0",
          "blue-tint": "#f0f6fc",
          "blue-soft": "#e0edfa",

          // Mapped tokens so both ipm-gold and ipm-blue point to the new #0d57a0 theme
          gold: "#0d57a0",
          "gold-hover": "#09447e",
          "gold-deep": "#0d57a0",
          "gold-badge": "#09447e",
          "gold-tint": "#f0f6fc",
          "gold-soft": "#e0edfa",
          dark: "#111827",
          "dark-elevated": "#1F2937",
          "dark-border": "#374151",
          surface: "#FAFAFA",
          "surface-alt": "#F4F4F5",
          border: "#E5E7EB",
          muted: "#4B5563",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
