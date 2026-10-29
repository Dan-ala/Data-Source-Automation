import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { DataSource, SourceStatus } from "@/types/source";

// 15 Fuentes objetivo seleccionadas del repositorio institucional OEDE - VAC
const TARGET_SOURCES = [
  // --- Grupo 1: Fuentes Estratégicas Iniciales ---
  {
    id: "icetex",
    folder: "ICETEX",
    name: "ICETEX",
    fullName: "Instituto Colombiano de Crédito Educativo y Estudios Técnicos en el Exterior",
    category: "Financiación y Becas",
    categoryColor: "border-cadit-yellow",
    periodicity: "Corte Semestral / Anual",
    description: "Ingesta y consolidación de créditos activos, condonaciones y cartera estudiantil.",
    recordsCount: 42890,
  },
  {
    id: "mintic",
    folder: "MINTIC",
    name: "MINTIC",
    fullName: "Ministerio de Tecnologías de la Información y las Comunicaciones",
    category: "Conectividad y TIC",
    categoryColor: "border-cadit-light-blue",
    periodicity: "Corte Trimestral",
    description: "Accesos a internet fijo municipal, penetración tecnológica y viabilidad de modalidad virtual.",
    recordsCount: 973335,
  },
  {
    id: "sena",
    folder: "SENA",
    name: "SENA",
    fullName: "Servicio Nacional de Aprendizaje",
    category: "Formación y Empleabilidad",
    categoryColor: "border-emerald-600",
    periodicity: "Corte Semestral",
    description: "Georreferenciación de centros de formación y programación de oferta académica técnica.",
    recordsCount: 15420,
  },
  {
    id: "snies",
    folder: "SNIES",
    subFolder: "SNIES",
    name: "SNIES",
    fullName: "Sistema Nacional de Información de la Educación Superior",
    category: "Sistema Universitario",
    categoryColor: "border-cadit-blue",
    periodicity: "Corte Anual",
    description: "Estadísticas de matrícula, oferta de programas aprobados, graduados e indicadores SPADIES/OLE.",
    recordsCount: 348200,
  },
  {
    id: "icfes",
    folder: "ICFES",
    subFolder: "Saber_Pro",
    name: "ICFES - SABER PRO",
    fullName: "Instituto Colombiano para la Evaluación de la Educación",
    category: "Calidad Académica",
    categoryColor: "border-indigo-600",
    periodicity: "Corte Anual",
    description: "Resultados agregados por competencias genéricas y específicas de evaluación Saber Pro.",
    recordsCount: 52400,
  },

  // --- Grupo 2: Competitividad y Entorno Regional ---
  {
    id: "idc",
    folder: "IDC",
    name: "IDC",
    fullName: "Índice Departamental de Competitividad",
    category: "Competitividad y Territorio",
    categoryColor: "border-amber-500",
    periodicity: "Corte Anual (2019-2026)",
    description: "Métricas de competitividad subnacional, educación superior, innovación y dinamismo empresarial.",
    recordsCount: 85200,
  },
  {
    id: "idic",
    folder: "IDIC",
    name: "IDIC",
    fullName: "Índice Departamental de Innovación para Colombia",
    category: "Innovación y Desarrollo",
    categoryColor: "border-purple-600",
    periodicity: "Corte Anual",
    description: "Capacidades, insumos y resultados del sistema de ciencia, tecnología e innovación departamental.",
    recordsCount: 12400,
  },
  {
    id: "sineb",
    folder: "SINEB",
    name: "SINEB",
    fullName: "Sistema Nacional de Información de Educación Básica y Media",
    category: "Educación Previa y Cobertura",
    categoryColor: "border-teal-600",
    periodicity: "Corte Anual",
    description: "Matrícula escolar, deserción escolar, transición a educación superior y caracterización estudiantil.",
    recordsCount: 182300,
  },
  {
    id: "planes_desarrollo",
    folder: "PlanesDesarrollo",
    name: "PLANES DE DESARROLLO",
    fullName: "Planes de Desarrollo Departamentales y Municipales de Colombia",
    category: "Planeación Territorial",
    categoryColor: "border-rose-600",
    periodicity: "Periodo Cuatrienal",
    description: "Documentos e instrumentos estratégicos de desarrollo regional para pertinencia académica institucional.",
    recordsCount: 2410,
  },
  {
    id: "educacion_latam",
    folder: "EducacionSuperiorLatam",
    name: "EDUCACIÓN SUPERIOR LATAM",
    fullName: "Benchmarking de Sistemas Universitarios en América Latina",
    category: "Internacionalización y Benchmarking",
    categoryColor: "border-sky-600",
    periodicity: "Corte Anual",
    description: "Estadísticas y anuarios universitarios de Argentina, Brasil, Chile, México, Perú y Uruguay.",
    recordsCount: 654000,
  },

  // --- Grupo 3: Nuevas 5 Fuentes Institucionales ---
  {
    id: "minciencias",
    folder: "MINCIENCIAS",
    name: "MINCIENCIAS",
    fullName: "Ministerio de Ciencia, Tecnología e Innovación",
    category: "Investigación e Innovación",
    categoryColor: "border-cadit-blue",
    periodicity: "Convocatorias Anuales",
    description: "Reconocimiento y clasificación de grupos de investigación, investigadores y escalafón científico.",
    recordsCount: 9570,
  },
  {
    id: "rnt",
    folder: "Registro Nacional Turismo",
    name: "REGISTRO NACIONAL DE TURISMO",
    fullName: "Ministerio de Comercio, Industria y Turismo (RNT)",
    category: "Sector Productivo y Turismo",
    categoryColor: "border-orange-500",
    periodicity: "Corte Mensual",
    description: "Prestadores de servicios turísticos activos, agencias, hospedajes y dinamismo comercial territorial.",
    recordsCount: 68400,
  },
  {
    id: "dane",
    folder: "DANE",
    subFolder: "GEIH",
    name: "DANE - GEIH / DEMOGRAFÍA",
    fullName: "Departamento Administrativo Nacional de Estadística",
    category: "Demografía y Mercado Laboral",
    categoryColor: "border-cadit-yellow",
    periodicity: "Corte Mensual / Trimestral",
    description: "Mercado laboral, desempleo, ingresos, población por departamento y cuentas nacionales.",
    recordsCount: 2450000,
  },
  {
    id: "secop",
    folder: "SECOP",
    name: "SECOP - CONTRATACIÓN PÚBLICA",
    fullName: "Sistema Electrónico de Contratación Pública (Colombia Compra Eficiente)",
    category: "Sector Público y Licitaciones",
    categoryColor: "border-emerald-700",
    periodicity: "Diario / Tiempo Real",
    description: "Licitaciones estatales, convenios interinstitucionales y contratación pública de entidades territoriales.",
    recordsCount: 154000,
  },
  {
    id: "terridata",
    folder: "TerriData",
    name: "TERRIDATA - DNP",
    fullName: "Sistema de Estadísticas Territoriales del DNP",
    category: "Desarrollo Territorial",
    categoryColor: "border-purple-600",
    periodicity: "Corte Semestral / Anual",
    description: "Fichas territoriales comparadas, finanzas públicas, cobertura educativa y calidad de vida municipal.",
    recordsCount: 98000,
  },
];

const DEFAULT_EXTERNAL_PATH = "C:\\Users\\danie\\uniminuto.edu\\G- Storage OEDE - VAC - FUENTES_T";

async function getDirectoryStats(dirPath: string) {
  let fileCount = 0;
  let latestMtime = new Date(0);

  async function walk(currentPath: string, depth = 0) {
    if (depth > 4) return;
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          await walk(full, depth + 1);
        } else if (entry.isFile()) {
          fileCount++;
          const stat = await fs.stat(full);
          if (stat.mtime > latestMtime) {
            latestMtime = stat.mtime;
          }
        }
      }
    } catch {
      // Ignora accesos no permitidos o directorios vacíos
    }
  }

  await walk(dirPath);
  return { fileCount, latestMtime };
}

export async function GET() {
  const basePath = process.env.EXTERNAL_FUENTES_PATH || DEFAULT_EXTERNAL_PATH;

  const resultSources: DataSource[] = [];

  for (const src of TARGET_SOURCES) {
    const targetFolder = src.subFolder 
      ? path.join(basePath, src.folder, src.subFolder)
      : path.join(basePath, src.folder);

    let hasDiccionario = false;
    let hasLeeme = false;
    let filesCount = 0;
    let lastUpdatedFormatted = "No disponible";
    let status: SourceStatus = "Al día";

    try {
      // 1. Verificar si existe la carpeta
      await fs.access(targetFolder);

      // 2. Verificar existencia de diccionario y guía
      const dictFolder = path.join(targetFolder, "Diccionarios");
      const guiaFolder = path.join(targetFolder, "Guia");

      try {
        const dictFiles = await fs.readdir(dictFolder);
        hasDiccionario = dictFiles.some(f => f.toLowerCase().endsWith(".md") || f.toLowerCase().endsWith(".txt") || f.toLowerCase().endsWith(".xlsx"));
      } catch {
        hasDiccionario = false;
      }

      try {
        const guiaFiles = await fs.readdir(guiaFolder);
        hasLeeme = guiaFiles.some(f => f.toLowerCase().includes("leeme") || f.toLowerCase().includes("descripcion") || f.toLowerCase().endsWith(".md") || f.toLowerCase().endsWith(".txt"));
      } catch {
        hasLeeme = false;
      }

      // 3. Inspeccionar conteo de archivos y última fecha de modificación
      const stats = await getDirectoryStats(targetFolder);
      filesCount = stats.fileCount;

      if (stats.latestMtime.getTime() > 0) {
        lastUpdatedFormatted = stats.latestMtime.toLocaleString("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        const daysDiff = (Date.now() - stats.latestMtime.getTime()) / (1000 * 60 * 60 * 24);
        status = daysDiff > 90 ? "Desactualizado" : "Al día";
      }
    } catch {
      status = "Desactualizado";
    }

    resultSources.push({
      id: src.id,
      name: src.name,
      fullName: src.fullName,
      category: src.category,
      categoryColor: src.categoryColor,
      status,
      lastUpdated: lastUpdatedFormatted,
      periodicity: src.periodicity,
      description: src.description,
      recordsCount: src.recordsCount,
      filesCount,
      hasDiccionario,
      hasLeeme,
      subPath: src.subFolder ? `${src.folder}/${src.subFolder}` : src.folder,
    });
  }

  return NextResponse.json({
    basePath,
    mode: "read-only",
    timestamp: new Date().toISOString(),
    totalSources: resultSources.length,
    sources: resultSources,
  });
}
