import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Fraunces", "Georgia", "'Times New Roman'", "serif"]
      },
      colors: {
        // Paleta Altamar: mar profundo, terracota, arena
        ink: "#13294B",
        sea: { DEFAULT: "#1F5F8B", light: "#DCE8F0" },
        terra: { DEFAULT: "#C4572E", dark: "#A3441F" },
        sand: { DEFAULT: "#F6F1E8", dark: "#E9DFCF" },
        olive: "#6B7A4B"
      },
      letterSpacing: { widest2: "0.22em" }
    }
  },
  plugins: []
};

export default config;
