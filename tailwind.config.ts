import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cadit: {
          blue: "#004A93",          // Azul UNIMINUTO principal
          yellow: "#FFD300",        // Amarillo acento
          navy: "#212844",          // Azul marino (Texto y contornos)
          white: "#FFFFFF",         // Blanco
          fog: "#F3F6FB",           // Niebla (Fondo suave de la plataforma)
          "light-blue": "#3D7CC9",  // Azul claro (Apoyo)
          "shadow-blue": "#00397A", // Azul sombra (Hover / Contraste)
          ochre: "#E0A800",         // Ocre (Sombra del amarillo)
        },
        uniminuto: {
          blue: "#004A93",
          navy: "#212844",
          "navy-dark": "#0A1C3D",
          yellow: "#FFD300",
          "yellow-hover": "#E0A800",
          red: "#E30613",
          green: "#00A859",
          fog: "#F3F6FB",
        },
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
