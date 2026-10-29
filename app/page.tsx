"use client";

import React, { useState, useEffect } from "react";
import { DataSource } from "@/types/source";
import { SourceCard } from "@/components/SourceCard";
import { DocumentModal } from "@/components/DocumentModal";
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search,
  Filter,
  Layers,
  Sparkles,
  RefreshCw,
  FolderSync,
  Info,
  Loader2
} from "lucide-react";

// Datos de inicialización de respaldo según las especificaciones del proyecto CADIT
const FALLBACK_SOURCES: DataSource[] = [
  {
    id: "icetex",
    name: "ICETEX",
    fullName: "Instituto Colombiano de Crédito Educativo y Estudios Técnicos en el Exterior",
    category: "Financiación y Becas",
    categoryColor: "border-cadit-yellow",
    status: "Al día",
    lastUpdated: "2026-10-28 14:11",
    periodicity: "Corte Semestral / Anual",
    description: "Ingesta y consolidación de créditos activos, condonaciones y cartera estudiantil.",
    recordsCount: 42890,
    filesCount: 7,
    subPath: "ICETEX",
  },
  {
    id: "mintic",
    name: "MINTIC",
    fullName: "Ministerio de Tecnologías de la Información y las Comunicaciones",
    category: "Conectividad y TIC",
    categoryColor: "border-cadit-light-blue",
    status: "Al día",
    lastUpdated: "2026-10-19 14:40",
    periodicity: "Corte Trimestral",
    description: "Accesos a internet fijo municipal, penetración tecnológica y viabilidad de modalidad virtual.",
    recordsCount: 973335,
    filesCount: 3,
    subPath: "MINTIC",
  },
  {
    id: "sena",
    name: "SENA",
    fullName: "Servicio Nacional de Aprendizaje",
    category: "Formación y Empleabilidad",
    categoryColor: "border-emerald-600",
    status: "Al día",
    lastUpdated: "2026-10-26 15:58",
    periodicity: "Corte Semestral",
    description: "Georreferenciación de centros de formación y programación de oferta académica técnica.",
    recordsCount: 15420,
    filesCount: 6,
    subPath: "SENA",
  },
  {
    id: "snies",
    name: "SNIES",
    fullName: "Sistema Nacional de Información de la Educación Superior",
    category: "Sistema Universitario",
    categoryColor: "border-cadit-blue",
    status: "Al día",
    lastUpdated: "2026-10-26 09:57",
    periodicity: "Corte Anual",
    description: "Estadísticas de matrícula, oferta de programas aprobados, graduados e indicadores SPADIES/OLE.",
    recordsCount: 348200,
    filesCount: 75,
    subPath: "SNIES",
  },
  {
    id: "icfes",
    name: "ICFES - SABER PRO",
    fullName: "Instituto Colombiano para la Evaluación de la Educación",
    category: "Calidad Académica",
    categoryColor: "border-indigo-600",
    status: "Al día",
    lastUpdated: "2026-10-22 12:34",
    periodicity: "Corte Anual",
    description: "Resultados agregados por competencias genéricas y específicas de evaluación Saber Pro.",
    recordsCount: 52400,
    filesCount: 52,
    subPath: "ICFES/Saber_Pro",
  },
  {
    id: "idc",
    name: "IDC",
    fullName: "Índice Departamental de Competitividad",
    category: "Competitividad y Territorio",
    categoryColor: "border-amber-500",
    status: "Al día",
    lastUpdated: "2026-10-28 15:00",
    periodicity: "Corte Anual (2019-2026)",
    description: "Métricas de competitividad subnacional, educación superior, innovación y dinamismo empresarial.",
    recordsCount: 85200,
    filesCount: 81,
    subPath: "IDC",
  },
  {
    id: "idic",
    name: "IDIC",
    fullName: "Índice Departamental de Innovación para Colombia",
    category: "Innovación y Desarrollo",
    categoryColor: "border-purple-600",
    status: "Al día",
    lastUpdated: "2026-10-26 11:20",
    periodicity: "Corte Anual",
    description: "Capacidades, insumos y resultados del sistema de ciencia, tecnología e innovación departamental.",
    recordsCount: 12400,
    filesCount: 7,
    subPath: "IDIC",
  },
  {
    id: "sineb",
    name: "SINEB",
    fullName: "Sistema Nacional de Información de Educación Básica y Media",
    category: "Educación Previa y Cobertura",
    categoryColor: "border-teal-600",
    status: "Al día",
    lastUpdated: "2026-10-25 09:30",
    periodicity: "Corte Anual",
    description: "Matrícula escolar, deserción escolar, transición a educación superior y caracterización estudiantil.",
    recordsCount: 182300,
    filesCount: 53,
    subPath: "SINEB",
  },
  {
    id: "planes_desarrollo",
    name: "PLANES DE DESARROLLO",
    fullName: "Planes de Desarrollo Departamentales y Municipales de Colombia",
    category: "Planeación Territorial",
    categoryColor: "border-rose-600",
    status: "Al día",
    lastUpdated: "2026-10-27 16:45",
    periodicity: "Periodo Cuatrienal",
    description: "Documentos e instrumentos estratégicos de desarrollo regional para pertinencia académica institucional.",
    recordsCount: 2410,
    filesCount: 241,
    subPath: "PlanesDesarrollo",
  },
  {
    id: "educacion_latam",
    name: "EDUCACIÓN SUPERIOR LATAM",
    fullName: "Benchmarking de Sistemas Universitarios en América Latina",
    category: "Internacionalización y Benchmarking",
    categoryColor: "border-sky-600",
    status: "Al día",
    lastUpdated: "2026-10-28 13:56",
    periodicity: "Corte Anual",
    description: "Estadísticas y anuarios universitarios de Argentina, Brasil, Chile, México, Perú y Uruguay.",
    recordsCount: 654000,
    filesCount: 613,
    subPath: "EducacionSuperiorLatam",
  },
  {
    id: "minciencias",
    name: "MINCIENCIAS",
    fullName: "Ministerio de Ciencia, Tecnología e Innovación",
    category: "Investigación e Innovación",
    categoryColor: "border-cadit-blue",
    status: "Al día",
    lastUpdated: "2026-10-19 15:30",
    periodicity: "Convocatorias Anuales",
    description: "Reconocimiento y clasificación de grupos de investigación, investigadores y escalafón científico.",
    recordsCount: 9570,
    filesCount: 3,
    subPath: "MINCIENCIAS",
  },
  {
    id: "rnt",
    name: "REGISTRO NACIONAL DE TURISMO",
    fullName: "Ministerio de Comercio, Industria y Turismo (RNT)",
    category: "Sector Productivo y Turismo",
    categoryColor: "border-orange-500",
    status: "Al día",
    lastUpdated: "2026-10-09 11:15",
    periodicity: "Corte Mensual",
    description: "Prestadores de servicios turísticos activos, agencias, hospedajes y dinamismo comercial territorial.",
    recordsCount: 68400,
    filesCount: 3,
    subPath: "Registro Nacional Turismo",
  },
  {
    id: "dane",
    name: "DANE - GEIH / DEMOGRAFÍA",
    fullName: "Departamento Administrativo Nacional de Estadística",
    category: "Demografía y Mercado Laboral",
    categoryColor: "border-cadit-yellow",
    status: "Al día",
    lastUpdated: "2026-10-27 16:50",
    periodicity: "Corte Mensual / Trimestral",
    description: "Mercado laboral, desempleo, ingresos, población por departamento y cuentas nacionales.",
    recordsCount: 2450000,
    filesCount: 7,
    subPath: "DANE/GEIH",
  },
  {
    id: "secop",
    name: "SECOP - CONTRATACIÓN PÚBLICA",
    fullName: "Sistema Electrónico de Contratación Pública (Colombia Compra Eficiente)",
    category: "Sector Público y Licitaciones",
    categoryColor: "border-emerald-700",
    status: "Al día",
    lastUpdated: "2026-10-25 14:00",
    periodicity: "Diario / Tiempo Real",
    description: "Licitaciones estatales, convenios interinstitucionales y contratación pública de entidades territoriales.",
    recordsCount: 154000,
    filesCount: 6,
    subPath: "SECOP",
  },
  {
    id: "terridata",
    name: "TERRIDATA - DNP",
    fullName: "Sistema de Estadísticas Territoriales del DNP",
    category: "Desarrollo Territorial",
    categoryColor: "border-purple-600",
    status: "Al día",
    lastUpdated: "2026-10-26 17:30",
    periodicity: "Corte Semestral / Anual",
    description: "Fichas territoriales comparadas, finanzas públicas, cobertura educativa y calidad de vida municipal.",
    recordsCount: 98000,
    filesCount: 5,
    subPath: "TerriData",
  },
];

export default function DashboardPage() {
  const [sources, setSources] = useState<DataSource[]>(FALLBACK_SOURCES);
  const [loadingSources, setLoadingSources] = useState<boolean>(true);
  const [repoPath, setRepoPath] = useState<string>("");
  const [updatingSources, setUpdatingSources] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  
  // Estado para la notificación flotante
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Estado para el modal de visualización de LEEME / Diccionario
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "LEEME" | "DICCIONARIO" | null;
    source: DataSource | null;
  }>({
    isOpen: false,
    type: null,
    source: null,
  });

  // Carga inicial dinámica desde el repositorio institucional externo en modo solo lectura
  const fetchSources = async () => {
    setLoadingSources(true);
    try {
      const res = await fetch("/api/sources");
      if (res.ok) {
        const data = await res.json();
        if (data.sources && Array.isArray(data.sources) && data.sources.length > 0) {
          setSources(data.sources);
        }
        if (data.basePath) {
          setRepoPath(data.basePath);
        }
      }
    } catch (err) {
      console.warn("Cargando fuentes de respaldo:", err);
    } finally {
      setLoadingSources(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  // Manejador del flujo de actualización mediante la API de Next.js
  const handleUpdateSource = async (source: DataSource) => {
    setUpdatingSources((prev) => ({ ...prev, [source.id]: true }));

    try {
      const response = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceName: source.name }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setSources((prev) =>
          prev.map((item) =>
            item.id === source.id
              ? {
                  ...item,
                  status: "Al día",
                  lastUpdated: data.fecha || new Date().toLocaleString("es-CO"),
                }
              : item
          )
        );

        setToast({
          message: `¡${source.name} sincronizado con éxito! Pipeline y diccionarios verificados.`,
          type: "success",
        });
      } else {
        throw new Error(data.message || "Error en el servidor");
      }
    } catch (error: any) {
      console.error("Error al sincronizar fuente:", error);
      setToast({
        message: `Fallo al sincronizar ${source.name}: ${error.message || "Error de conexión"}`,
        type: "error",
      });
    } finally {
      setUpdatingSources((prev) => ({ ...prev, [source.id]: false }));
      setTimeout(() => setToast(null), 4000);
    }
  };

  // Abrir modal de LEEME o Diccionario
  const handleOpenDocModal = (type: "LEEME" | "DICCIONARIO", source: DataSource) => {
    setModalConfig({
      isOpen: true,
      type,
      source,
    });
  };

  // Métricas para los KPIs superiores
  const totalSources = sources.length;
  const upToDateCount = sources.filter((s) => s.status === "Al día").length;
  const outdatedCount = sources.filter((s) => s.status === "Desactualizado").length;
  const failureCount = sources.filter((s) => s.status === "Fallo").length;

  // Filtrado de fuentes
  const filteredSources = sources.filter((src) => {
    const matchesSearch =
      src.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      src.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      src.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "TODOS" || src.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-cadit-fog">
      {/* Toast Notification Flotante */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`px-5 py-3.5 rounded-xl shadow-xl border flex items-center gap-3 text-sm font-medium ${
              toast.type === "success"
                ? "bg-cadit-navy text-white border-emerald-500/50"
                : "bg-red-900 text-white border-red-500"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-cadit-yellow shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Oficial CADIT - UNIMINUTO (Azul #004A93 + Búho en Pixel Art + Acento Amarillo #FFD300) */}
      <header className="bg-cadit-blue text-white shadow-lg border-b-4 border-cadit-yellow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo de Marca CADIT y Titular */}
            <div className="flex items-center gap-4">
              <div className="p-1.5 bg-cadit-navy/40 rounded-xl border border-white/10 shrink-0">
                <img 
                  src="/brand/CADIT-logo-horizontal-negativo.svg" 
                  alt="CADIT UNIMINUTO" 
                  className="h-10 w-auto object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-cadit-navy bg-cadit-yellow px-2 py-0.5 rounded">
                    UNIMINUTO
                  </span>
                  <span className="text-xs text-white/90 font-medium">
                    Vicerrectoría Académica • OEDE
                  </span>
                  <span className="text-xs text-emerald-300 flex items-center gap-1 ml-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Solo Lectura
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                  Data Sources Automation <span className="text-cadit-yellow font-normal">(DSA)</span>
                </h1>
                <p className="text-xs text-white/80">
                  Panel de Consulta, Metadatos, ETL y Diccionarios de Fuentes Institucionales
                </p>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex items-center gap-3">
              <button
                onClick={fetchSources}
                disabled={loadingSources}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-all border border-white/20 active:scale-95"
                title="Recargar metadatos desde el repositorio de red"
              >
                <FolderSync className={`w-3.5 h-3.5 ${loadingSources ? "animate-spin" : ""}`} />
                <span>Refrescar Fuentes</span>
              </button>

              <button
                onClick={() => {
                  sources.forEach((s) => {
                    if (s.status !== "Al día") handleUpdateSource(s);
                  });
                }}
                className="bg-cadit-yellow hover:bg-cadit-ochre text-cadit-navy font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                title="Sincronizar fuentes pendientes"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cadit-navy" />
                <span>Sincronizar Pendientes</span>
              </button>
            </div>
          </div>

          {/* Barra Informativa de Ruta de Repositorio de Red */}
          <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between text-[11px] text-white/80 gap-2">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-cadit-yellow shrink-0" />
              <span>Repositorio activo:</span>
              <code className="bg-cadit-navy/60 px-2 py-0.5 rounded text-cadit-yellow font-mono text-[10px]">
                {repoPath || "C:\\Users\\danie\\uniminuto.edu\\G- Storage OEDE - VAC - FUENTES_T"}
              </code>
            </div>
            <span className="text-white/60">
              Conexión directa en modo lectura sin duplicación de archivos
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Fuentes</p>
              <p className="text-2xl font-black text-cadit-navy mt-1">{totalSources}</p>
            </div>
            <div className="p-3 bg-cadit-fog rounded-lg text-cadit-blue">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Al Día</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{upToDateCount}</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Desactualizadas</p>
              <p className="text-2xl font-black text-amber-700 mt-1">{outdatedCount}</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg border border-cadit-yellow">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Con Fallo</p>
              <p className="text-2xl font-black text-[#E30613] mt-1">{failureCount}</p>
            </div>
            <div className="p-3 bg-red-50 text-[#E30613] rounded-lg border border-red-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Input de Búsqueda */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por fuente, categoría o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cadit-fog border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-cadit-blue focus:bg-white transition-all text-cadit-navy"
            />
          </div>

          {/* Filtros de Estado */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-cadit-blue" /> Estado:
            </span>
            {(["TODOS", "Al día", "Desactualizado", "Fallo"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === filter
                    ? "bg-cadit-blue text-white shadow-xs"
                    : "bg-cadit-fog text-cadit-navy hover:bg-slate-200/80"
                }`}
              >
                {filter === "TODOS" ? "Todas" : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Loader o Grid de Tarjetas de Fuentes */}
        {loadingSources ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-cadit-blue" />
            <p className="text-sm font-semibold text-cadit-navy">
              Inspeccionando repositorio institucional en modo solo lectura...
            </p>
            <p className="text-xs text-slate-500">
              Conectando con G- Storage OEDE - VAC - FUENTES_T
            </p>
          </div>
        ) : filteredSources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSources.map((source) => (
              <SourceCard
                key={source.id}
                source={source}
                isUpdating={!!updatingSources[source.id]}
                onUpdate={handleUpdateSource}
                onViewDoc={handleOpenDocModal}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <div className="w-12 h-12 bg-cadit-fog rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Search className="w-6 h-6 text-cadit-blue" />
            </div>
            <h3 className="text-base font-bold text-cadit-navy">No se encontraron fuentes</h3>
            <p className="text-xs text-slate-500 mt-1">
              Prueba modificando el término de búsqueda o cambiando los filtros de estado.
            </p>
          </div>
        )}

        {/* Sección Informativa del Flujo de Automatización CADIT */}
        <div className="bg-gradient-to-r from-cadit-blue to-cadit-navy rounded-2xl p-6 text-white shadow-md border-t-4 border-cadit-yellow">
          <div className="flex items-center gap-2 text-cadit-yellow text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            Flujo Estandarizado CADIT UNIMINUTO (5 Pasos)
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            Ciclo de Vida y Estandarización de Fuentes
          </h2>
          <p className="text-xs text-white/80 max-w-3xl mb-4">
            Cada fuente en el almacenamiento OEDE está homologada bajo una estructura de 5 componentes que garantiza gobernanza de datos y trazabilidad:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="font-mono text-cadit-yellow font-bold block mb-1">1. Archivos/</span>
              <p className="text-white/80 text-[11px]">
                Descargas brutas e inmutables (CSV, XLSX, APIs).
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="font-mono text-cadit-yellow font-bold block mb-1">2. ETL/</span>
              <p className="text-white/80 text-[11px]">
                Scripts de limpieza, reglas de negocio y logs de auditoría.
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="font-mono text-cadit-yellow font-bold block mb-1">3. Diccionarios/</span>
              <p className="text-white/80 text-[11px]">
                Catálogo técnico de variables homologadas en Markdown.
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="font-mono text-cadit-yellow font-bold block mb-1">4. Guia/</span>
              <p className="text-white/80 text-[11px]">
                Archivo LEEME.txt, metadatos y descripción general.
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="font-mono text-cadit-yellow font-bold block mb-1">5. Procesados/</span>
              <p className="text-white/80 text-[11px]">
                Datasets normalizados para Power BI y tableros institucionales.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Institucional CADIT UNIMINUTO */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <img 
              src="/brand/CADIT-icono-cabeza.svg" 
              alt="Búho CADIT" 
              className="w-5 h-5 object-contain" 
            />
            <p>
              © {new Date().getFullYear()} Corporación Universitaria Minuto de Dios - <strong>UNIMINUTO</strong>. Unidad CADIT.
            </p>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>Conocimiento, Analítica, Datos, IA y Transformación Digital</span>
            <span>•</span>
            <span>Vicerrectoría Académica</span>
          </div>
        </div>
      </footer>

      {/* Modal para visualizar LEEME.txt o Diccionario.md en tiempo real */}
      <DocumentModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false, type: null, source: null })}
        type={modalConfig.type}
        source={modalConfig.source}
      />
    </div>
  );
}
