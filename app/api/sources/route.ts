import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { DataSource, SourceStatus } from "@/types/source";

// 36 Fuentes objetivo seleccionadas del repositorio institucional OEDE - VAC
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

  // --- Grupo 4: Permanencia, Graduados y Pruebas de Estado ---
  {
    id: "spadies",
    folder: "SNIES",
    subFolder: "SPADIES",
    name: "SPADIES",
    fullName: "Sistema para la Prevención de la Deserción en la Educación Superior",
    category: "Permanencia y Deserción",
    categoryColor: "border-rose-600",
    periodicity: "Corte Semestral / Anual",
    description: "Tasas de deserción y retención estudiantil por cohorte, determinantes socioeconómicos e institucionales.",
    recordsCount: 1347000,
  },
  {
    id: "ole",
    folder: "SNIES",
    subFolder: "OLE",
    name: "OLE - OBSERVATORIO LABORAL",
    fullName: "Observatorio Laboral para la Educación (Graduados e Inserción)",
    category: "Graduados e Inserción Laboral",
    categoryColor: "border-cadit-yellow",
    periodicity: "Corte Anual",
    description: "Seguimiento a la vinculación formal de graduados de educación superior, tasas de cotización e ingreso base.",
    recordsCount: 490000,
  },
  {
    id: "saber_11",
    folder: "ICFES",
    subFolder: "Saber_11",
    name: "ICFES - SABER 11",
    fullName: "Examen de Estado de la Educación Media Saber 11",
    category: "Educación Media y Aspirantes",
    categoryColor: "border-indigo-600",
    periodicity: "Corte Semestral (11-1 y 11-2)",
    description: "Resultados por componentes genéricos y áreas del núcleo común de bachilleres para perfilamiento de ingreso.",
    recordsCount: 650000,
  },
  {
    id: "saber_tyt",
    folder: "ICFES",
    subFolder: "Saber_TyT",
    name: "ICFES - SABER TyT",
    fullName: "Evaluación de la Educación Técnica y Tecnológica Saber TyT",
    category: "Formación Técnica y Tecnológica",
    categoryColor: "border-teal-600",
    periodicity: "Corte Semestral",
    description: "Evaluación de competencias genéricas y específicas en formación técnica profesional y tecnológica.",
    recordsCount: 95000,
  },
  {
    id: "pre_saber",
    folder: "ICFES",
    subFolder: "Pre_Saber",
    name: "ICFES - PRE SABER",
    fullName: "Examen de Ensayo y Diagnóstico Pre Saber",
    category: "Diagnóstico y Articulación Escolar",
    categoryColor: "border-cadit-blue",
    periodicity: "Corte Semestral",
    description: "Pruebas de ensayo y diagnóstico vocacional para estudiantes de grados 10° y 11° de educación media.",
    recordsCount: 45000,
  },

  // --- Grupo 5: Empleo, Empresas y Sector Productivo ---
  {
    id: "rues",
    folder: "RUES",
    name: "RUES - CONFECÁMARAS",
    fullName: "Registro Único Empresarial y Social de las Cámaras de Comercio",
    category: "Sector Empresarial y Cámaras",
    categoryColor: "border-amber-500",
    periodicity: "Corte Mensual / Trimestral",
    description: "Empresas activas, creación y disolución de sociedades, tejido empresarial territorial y formalidad económica.",
    recordsCount: 1850000,
  },
  {
    id: "servicio_empleo",
    folder: "ServicioEmpleo",
    name: "SERVICIO PÚBLICO DE EMPLEO",
    fullName: "Unidad Administrativa Especial del Servicio Público de Empleo (SPE)",
    category: "Empleabilidad y Demanda Laboral",
    categoryColor: "border-emerald-600",
    periodicity: "Corte Mensual",
    description: "Vacantes laborales registradas, demanda de ocupaciones, perfiles requeridos y brechas de capital humano.",
    recordsCount: 420000,
  },
  {
    id: "reps",
    folder: "REPS",
    name: "REPS - SALUD",
    fullName: "Registro Especial de Prestadores de Servicios de Salud (Minsalud)",
    category: "Sector Salud y Cobertura",
    categoryColor: "border-sky-600",
    periodicity: "Corte Mensual",
    description: "Prestadores de salud habilitados, sedes, capacidad instalada y demanda de talento en ciencias de la salud.",
    recordsCount: 78000,
  },
  {
    id: "patentes_sic",
    folder: "PATENTES_SIC",
    name: "PATENTES - SIC",
    fullName: "Superintendencia de Industria y Comercio (Propiedad Industrial)",
    category: "Propiedad Intelectual e Innovación",
    categoryColor: "border-purple-600",
    periodicity: "Corte Trimestral / Anual",
    description: "Solicitudes y concesiones de patentes de invención, modelos de utilidad y registro de marcas por departamento.",
    recordsCount: 16500,
  },
  {
    id: "simo",
    folder: "SIMO",
    name: "SIMO - CNSC",
    fullName: "Sistema de Apoyo para la Igualdad, el Mérito y la Oportunidad (CNSC)",
    category: "Empleo Público y Concursos",
    categoryColor: "border-indigo-600",
    periodicity: "Por Convocatoria",
    description: "Oferta de empleo público de carrera administrativa, perfiles requeridos por entidades territoriales y requisitos.",
    recordsCount: 31000,
  },

  // --- Grupo 6: Finanzas Públicas y Regalías ---
  {
    id: "sgr",
    folder: "SGR",
    name: "SGR - REGALÍAS",
    fullName: "Sistema General de Regalías (Departamento Nacional de Planeación)",
    category: "Inversión y Desarrollo Regional",
    categoryColor: "border-cadit-blue",
    periodicity: "Corte Trimestral",
    description: "Proyectos de inversión regional aprobados, asignación presupuestal y regalías territoriales para infraestructura y educación.",
    recordsCount: 48900,
  },
  {
    id: "dian",
    folder: "DIAN",
    name: "DIAN",
    fullName: "Dirección de Impuestos y Aduanas Nacionales",
    category: "Tributación y Comercio Exterior",
    categoryColor: "border-cadit-yellow",
    periodicity: "Corte Mensual / Anual",
    description: "Recaudo tributario municipal y departamental, operaciones aduaneras, balanza comercial y formalización tributaria.",
    recordsCount: 520000,
  },

  // --- Grupo 7: Demografía, Entorno Espacial y Tendencias ---
  {
    id: "estadisticas_vitales",
    folder: "Estadísticas Vitales",
    name: "ESTADÍSTICAS VITALES",
    fullName: "DANE - Estadísticas Vitales (Nacimientos y Defunciones)",
    category: "Demografía y Población",
    categoryColor: "border-rose-600",
    periodicity: "Corte Anual",
    description: "Dinámica demográfica, tasas de natalidad, fecundidad y proyecciones de cohorte de población infantil y juvenil.",
    recordsCount: 890000,
  },
  {
    id: "geoportal_dane",
    folder: "GeoportalDANE",
    name: "GEOPORTAL DANE",
    fullName: "DANE - Infraestructura de Datos Espaciales y Cartografía Geoestadística",
    category: "Georreferenciación y Territorio",
    categoryColor: "border-teal-600",
    periodicity: "Corte Anual",
    description: "Cartografía censal, límites político-administrativos, manzanas urbanas y distribución espacial de la población.",
    recordsCount: 112000,
  },
  {
    id: "google_trends",
    folder: "Google Trends",
    name: "GOOGLE TRENDS",
    fullName: "Google Trends - Análisis de Tendencias de Búsqueda Vocacional",
    category: "Tendencias Digitales y Mercado",
    categoryColor: "border-cadit-light-blue",
    periodicity: "Monitoreo Continuo",
    description: "Índices de interés de búsqueda y demanda digital de programas académicos, carreras universitarias y habilidades.",
    recordsCount: 350000,
  },
  {
    id: "inegi",
    folder: "INEGI MEXICO",
    name: "INEGI MÉXICO",
    fullName: "Instituto Nacional de Estadística y Geografía de México",
    category: "Internacionalización y Benchmarking",
    categoryColor: "border-slate-500",
    periodicity: "Corte Anual",
    description: "Estadísticas demográficas, laborales, educativas y de competitividad del sistema mexicano para benchmarking.",
    recordsCount: 430000,
  },

  // --- Grupo 8: Calidad Básica, Acreditación y Censos Especializados ---
  {
    id: "snies_acreditacion",
    folder: "SNIES",
    subFolder: "Acreditacion",
    name: "CNA - ACREDITACIÓN DE ALTA CALIDAD",
    fullName: "Consejo Nacional de Acreditación / SNIES",
    category: "Acreditación y Calidad",
    categoryColor: "border-cadit-blue",
    periodicity: "Resoluciones Mensuales / Anuales",
    description: "Registro de programas e instituciones de educación superior con acreditación de alta calidad vigente y resoluciones.",
    recordsCount: 4200,
  },
  {
    id: "saber_3_5_9",
    folder: "ICFES",
    subFolder: "Saber_3_5_y_9",
    name: "ICFES - SABER 3° 5° Y 9°",
    fullName: "Evaluación de la Educación Básica Saber 3°, 5° y 9°",
    category: "Educación Básica y Primaria",
    categoryColor: "border-amber-600",
    periodicity: "Corte Periódico",
    description: "Competencias básicas en lenguaje, matemáticas y ciudadanas en etapas tempranas de educación básica.",
    recordsCount: 185000,
  },
  {
    id: "dane_censo",
    folder: "DANE",
    subFolder: "CENSO",
    name: "DANE - CENSO POBLACIONAL",
    fullName: "Censo Nacional de Población y Vivienda (CNPV)",
    category: "Demografía y Hogares",
    categoryColor: "border-cadit-yellow",
    periodicity: "Censo Decenal / Proyecciones",
    description: "Población total por municipio, grupos de edad, hogares, servicios públicos y caracterización socioeconómica.",
    recordsCount: 48258494,
  },
  {
    id: "dane_pib",
    folder: "DANE",
    subFolder: "PIB",
    name: "DANE - PIB DEPARTAMENTAL",
    fullName: "DANE - Cuentas Nacionales y Producto Interno Bruto Subnacional",
    category: "Economía Subnacional",
    categoryColor: "border-emerald-700",
    periodicity: "Corte Anual",
    description: "Valor agregado por ramas de actividad económica, participación departamental en el PIB y crecimiento sectorial.",
    recordsCount: 65000,
  },
  {
    id: "dane_pobreza",
    folder: "DANE",
    subFolder: "POBREZA",
    name: "DANE - POBREZA Y CONDICIONES DE VIDA",
    fullName: "DANE - Medición de Pobreza Monetaria y Multidimensional",
    category: "Desarrollo Social y Equidad",
    categoryColor: "border-rose-700",
    periodicity: "Corte Anual",
    description: "Incidencia de pobreza monetaria, coeficientes de Gini municipal y privaciones del Índice de Pobreza Multidimensional (IPM).",
    recordsCount: 120000,
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
