import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DEFAULT_EXTERNAL_PATH = "C:\\Users\\danie\\uniminuto.edu\\G- Storage OEDE - VAC - FUENTES_T";

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
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source")?.toLowerCase() || "";
  const type = searchParams.get("type")?.toUpperCase() || "LEEME";

  const basePath = process.env.EXTERNAL_FUENTES_PATH || DEFAULT_EXTERNAL_PATH;
  const relativeFolder = SOURCE_MAP[source] || source.toUpperCase();
  const targetDir = path.join(basePath, ...relativeFolder.split("/"));

  try {
    if (type === "LEEME") {
      const guiaDir = path.join(targetDir, "Guia");
      let foundFile = "";
      let content = "";

      try {
        const files = await fs.readdir(guiaDir);
        // Priorizar LEEME.txt o LEEME.md, luego DESCRIPCION_GENERAL, luego metadatos.json
        const leemeFile = files.find(f => f.toLowerCase().startsWith("leeme"));
        const descFile = files.find(f => f.toLowerCase().includes("descripcion"));
        const metaFile = files.find(f => f.toLowerCase() === "metadatos.json");

        const target = leemeFile || descFile || metaFile || files.find(f => f.endsWith(".md") || f.endsWith(".txt")) || files[0];
        if (target) {
          foundFile = target;
          content = await fs.readFile(path.join(guiaDir, target), "utf-8");
        }
      } catch (err: any) {
        return NextResponse.json(
          { error: `No se encontró carpeta Guia para ${source}: ${err.message}` },
          { status: 404 }
        );
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
        } else {
          // Si no hay archivo .md o .txt directo (ej. hay subcarpetas o .xlsx/.pdf), generar un índice descriptivo de los insumos
          const allItems = files.map(f => `- **${f.name}** (${f.isDirectory() ? "Subdirectorio" : "Archivo"})`).join("\n");
          foundFile = "Catalogo_Insumos.md";
          content = `# Catálogo de Variables e Insumos Técnicos - ${source.toUpperCase()}\n\n` +
            `**Ubicación:** \`Diccionarios/\`\n\n` +
            `Esta fuente cuenta con los siguientes archivos y catálogos en su directorio oficial:\n\n` +
            allItems + `\n\n` +
            `> **Nota:** Puedes consultar las fichas de metadatos o consultar la guía operativa en la pestaña **Ver LEEME**.`;
        }
      } catch (err: any) {
        return NextResponse.json(
          { error: `No se encontró carpeta Diccionarios para ${source}: ${err.message}` },
          { status: 404 }
        );
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
