import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CADIT | Sistema de Fuentes de Datos UNIMINUTO",
  description: "Sistema de automatización, monitoreo y orquestación de fuentes de datos para la unidad CADIT de UNIMINUTO.",
  icons: {
    icon: "/brand/CADIT-icono-cabeza.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={ibmPlexSans.variable}>
      <body className="bg-cadit-fog text-cadit-navy font-sans min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
