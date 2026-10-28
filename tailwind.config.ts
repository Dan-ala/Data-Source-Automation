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
        uniminuto: {
          navy: "#0A1C3D",        // Azul Marino institucional (Header, fondos oscuros)
          "navy-light": "#152D5E",
          yellow: "#FFC000",      // Amarillo institucional (Botones y destacados)
          "yellow-hover": "#E5AC00",
          red: "#E30613",         // Rojo institucional (Alertas y errores)
          green: "#00A859",       // Verde institucional (Éxito y al día)
        },
      },
    },
  },
  plugins: [],
};

export default config;
