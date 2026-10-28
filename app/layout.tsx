import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Data Sources Automation (DSA) | CADIT UNIMINUTO",
  description: "Sistema de automatización, monitoreo y orquestación de fuentes de datos para la unidad CADIT de UNIMINUTO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-slate-800 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
