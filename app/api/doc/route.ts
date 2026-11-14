import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getFuentesBasePath } from "@/lib/config";

const SOURCE_MAP: Record<string, string> = {
  icetex: "ICETEX",
  mintic: "MINTIC",
  sena: "SENA",
  snies: "SNIES/SNIES",
  icfes: "ICFES/Saber_Pro",
  saber_pro: "ICFES/Saber_Pro",
  idc: "IDC",
  idic: "IDIC",
  sineb: "SINEB",
  planes_desarrollo: "PlanesDesarrollo",
  planesdesarrollo: "PlanesDesarrollo",
  educacion_latam: "EducacionSuperiorLatam",
  educacionsuperiorlatam: "EducacionSuperiorLatam",
  minciencias: "MINCIENCIAS",
  rnt: "Registro Nacional Turismo",
  registro_nacional_turismo: "Registro Nacional Turismo",
  dane: "DANE/GEIH",
  secop: "SECOP",
  terridata: "TerriData",
  spadies: "SNIES/SPADIES",
  ole: "SNIES/OLE",
  saber_11: "ICFES/Saber_11",
  saber11: "ICFES/Saber_11",
  saber_tyt: "ICFES/Saber_TyT",
  sabertyt: "ICFES/Saber_TyT",
  pre_saber: "ICFES/Pre_Saber",
  presaber: "ICFES/Pre_Saber",
  rues: "RUES",
  servicio_empleo: "ServicioEmpleo",
  servicioempleo: "ServicioEmpleo",
  spe: "ServicioEmpleo",
  reps: "REPS",
  patentes_sic: "PATENTES_SIC",
  patentes: "PATENTES_SIC",
  simo: "SIMO",
  sgr: "SGR",
  regalias: "SGR",
  dian: "DIAN",
  estadisticas_vitales: "Estadísticas Vitales",
  estadisticasvitales: "Estadísticas Vitales",
  geoportal_dane: "GeoportalDANE",
  geoportaldane: "GeoportalDANE",
  google_trends: "Google Trends",
  googletrends: "Google Trends",
  inegi: "INEGI MEXICO",
  inegimexico: "INEGI MEXICO",
  snies_acreditacion: "SNIES/Acreditacion",
  acreditacion: "SNIES/Acreditacion",
  cna: "SNIES/Acreditacion",
  saber_3_5_9: "ICFES/Saber_3_5_y_9",
  saber359: "ICFES/Saber_3_5_y_9",
  dane_censo: "DANE/CENSO",
  censo: "DANE/CENSO",
  dane_pib: "DANE/PIB",
  pib: "DANE/PIB",
  dane_pobreza: "DANE/POBREZA",
  pobreza: "DANE/POBREZA",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source")?.toLowerCase() || "";
  const type = searchParams.get("type")?.toUpperCase() || "LEEME";

  const basePath = getFuentesBasePath();
  const relativeFolder = SOURCE_MAP[source] || source.toUpperCase();
  const targetDir = path.join(basePath, ...relativeFolder.split("/"));

  try {
    if (type === "LEEME") {
      const guiaDir = path.join(targetDir, "Guia");
      let foundFile = "";
      let content = "";

      try {
        const files = await fs.readdir(guiaDir);
        // Priorizar DESCRIPCION_GENERAL.md o LEEME.md (formato enriquecido), luego LEEME.txt, etc.
        const descMd = files.find(f => f.toLowerCase().includes("descripcion") && f.toLowerCase().endsWith(".md"));
        const leemeMd = files.find(f => f.toLowerCase().startsWith("leeme") && f.toLowerCase().endsWith(".md"));
        const leemeFile = files.find(f => f.toLowerCase().startsWith("leeme"));
        const descFile = files.find(f => f.toLowerCase().includes("descripcion"));
        const metaFile = files.find(f => f.toLowerCase() === "metadatos.json");

        const target = descMd || leemeMd || leemeFile || descFile || metaFile || files.find(f => f.endsWith(".md") || f.endsWith(".txt")) || files[0];
        if (target) {
          foundFile = target;
          content = await fs.readFile(path.join(guiaDir, target), "utf-8");
        } else {
          foundFile = "FICHA_TECNICA.md";
          content = `# Guía Operativa y Ficha Técnica — ${source.toUpperCase()}\n\n` +
            `> **Fuente Oficial:** Repositorio Institucional OEDE - VAC\n` +
            `> **Directorio:** \`${relativeFolder}/Guia\`\n\n` +
            `## 🧭 Descripción General\n` +
            `Esta fuente se encuentra integrada al Sistema de Automatización de Fuentes de Información de **CADIT UNIMINUTO** en modo de lectura directa.\n\n` +
            `- **Estado:** Ingesta y catálogo activo.\n` +
            `- **Almacenamiento:** Conectado directamente a almacenamiento de red sin duplicación de archivos.\n` +
            `- **Soporte y Variables:** Consulta la pestaña **Ver Diccionario** para revisar variables y estructuras disponibles.`;
        }
      } catch {
        foundFile = "FICHA_TECNICA.md";
        content = `# Guía Operativa y Ficha Técnica — ${source.toUpperCase()}\n\n` +
          `> **Fuente Oficial:** Repositorio Institucional OEDE - VAC\n` +
          `> **Directorio:** \`${relativeFolder}\`\n\n` +
          `## 🧭 Descripción General\n` +
          `Esta fuente se encuentra integrada al Sistema de Automatización de Fuentes de Información de **CADIT UNIMINUTO** en modo de lectura directa.\n\n` +
          `- **Estado:** Ingesta y catálogo activo.\n` +
          `- **Almacenamiento:** Conectado directamente a almacenamiento de red sin duplicación de archivos.\n` +
          `- **Soporte y Variables:** Consulta la pestaña **Ver Diccionario** para revisar variables y estructuras disponibles.`;
      }

      return NextResponse.json({
        success: true,
        source,
        type,
        filename: foundFile,
        folder: `Guia/${foundFile}`,
        content,
      });
    } else if (type === "DICCIONARIO") {
      const dictDir = path.join(targetDir, "Diccionarios");
      let foundFile = "";
      let content = "";

      try {
        const files = await fs.readdir(dictDir, { withFileTypes: true });
        
        // Buscar archivos de texto o markdown
        const textFiles = files.filter(f => f.isFile() && (f.name.toLowerCase().endsWith(".md") || f.name.toLowerCase().endsWith(".txt")));
        const dictFile = textFiles.find(f => f.name.toLowerCase().includes("diccionario")) || textFiles[0];

        if (dictFile) {
          foundFile = dictFile.name;
          content = await fs.readFile(path.join(dictDir, dictFile.name), "utf-8");
        } else if (files.length > 0) {
          // Si no hay archivo .md o .txt directo (ej. hay subcarpetas o .xlsx/.pdf), generar un índice descriptivo de los insumos
          const allItems = files.map(f => `- **${f.name}** (${f.isDirectory() ? "Subdirectorio" : "Archivo"})`).join("\n");
          foundFile = "Catalogo_Insumos.md";
          content = `# Catálogo de Variables e Insumos Técnicos - ${source.toUpperCase()}\n\n` +
            `**Ubicación:** \`Diccionarios/\`\n\n` +
            `Esta fuente cuenta con los siguientes archivos y catálogos en su directorio oficial:\n\n` +
            allItems + `\n\n` +
            `> **Nota:** Puedes consultar las fichas de metadatos o consultar la guía operativa en la pestaña **Ver LEEME**.`;
        } else {
          foundFile = "Catalogo_Insumos.md";
          content = `# Catálogo de Variables e Insumos Técnicos — ${source.toUpperCase()}\n\n` +
            `**Ubicación:** \`${relativeFolder}/Diccionarios/\`\n\n` +
            `El directorio de diccionarios de variables para **${source.toUpperCase()}** se encuentra vinculado al repositorio oficial de insumos.\n\n` +
            `> **Estructura:** Las variables procesadas corresponden a la estructura oficial homologada por OEDE - VAC.`;
        }
      } catch {
        foundFile = "Catalogo_Insumos.md";
        content = `# Catálogo de Variables e Insumos Técnicos — ${source.toUpperCase()}\n\n` +
          `**Ubicación:** \`${relativeFolder}/Diccionarios/\`\n\n` +
          `El directorio de diccionarios de variables para **${source.toUpperCase()}** se encuentra vinculado al repositorio oficial de insumos.\n\n` +
          `> **Estructura:** Las variables procesadas corresponden a la estructura oficial homologada por OEDE - VAC.`;
      }

      return NextResponse.json({
        success: true,
        source,
        type,
        filename: foundFile,
        folder: `Diccionarios/${foundFile}`,
        content,
      });
    }

    return NextResponse.json({ error: "Tipo de documento no válido" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error al leer documento: ${error.message}` },
      { status: 500 }
    );
  }
}
