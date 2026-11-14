import os from "os";
import fs from "fs";
import path from "path";

/**
 * Obtiene la ruta del repositorio FUENTES_T de manera dinámica:
 * 1. Variable de entorno EXTERNAL_FUENTES_PATH si está definida.
 * 2. Ruta calculada desde el home del usuario del sistema actual (Laptop: danie, PC Uni: daniel.alarcon.f).
 * 3. Rutas conocidas fijas como respaldo comprobando su existencia física en disco.
 */
export function getFuentesBasePath(): string {
  // 1. Variable de entorno configurada
  if (process.env.EXTERNAL_FUENTES_PATH && fs.existsSync(process.env.EXTERNAL_FUENTES_PATH)) {
    return process.env.EXTERNAL_FUENTES_PATH;
  }

  // 2. Ruta dinámica según el usuario del SO activo
  const userHomeFuentes = path.join(os.homedir(), "uniminuto.edu", "G- Storage OEDE - VAC - FUENTES_T");
  if (fs.existsSync(userHomeFuentes)) {
    return userHomeFuentes;
  }

  // 3. Rutas fijas conocidas (PC institucional y laptop)
  const candidatePaths = [
    "C:\\Users\\daniel.alarcon.f\\uniminuto.edu\\G- Storage OEDE - VAC - FUENTES_T",
    "C:\\Users\\danie\\uniminuto.edu\\G- Storage OEDE - VAC - FUENTES_T",
  ];

  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // Fallback por defecto si aún no está sincronizado
  return process.env.EXTERNAL_FUENTES_PATH || userHomeFuentes;
}

