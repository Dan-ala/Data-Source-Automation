"use client";

import React, { useState } from "react";
import { DataSource } from "@/types/source";
import { SourceCard } from "@/components/SourceCard";
import { DocumentModal } from "@/components/DocumentModal";
import { 
  Database, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search,
  Filter,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink
} from "lucide-react";

// Datos de prueba (Mock Data) según las especificaciones del proyecto CADIT
const INITIAL_SOURCES: DataSource[] = [
  {
    id: "icetex",
    name: "ICETEX",
    fullName: "Instituto Colombiano de Crédito Educativo y Estudios Técnicos en el Exterior",
    category: "Financiación y Becas",
    categoryColor: "border-pink-500", // Color de borde del tablero físico (Rosado)
    status: "Al día",
    lastUpdated: "2026-10-27 16:34",
    periodicity: "Corte Mensual",
    description: "Ingesta y consolidación de créditos activos, condonaciones y cartera estudiantil.",
    recordsCount: 42890,
  },
  {
    id: "dane",
    name: "DANE",
    fullName: "Departamento Administrativo Nacional de Estadística",
    category: "Demografía y Territorio",
    categoryColor: "border-orange-500", // Color de borde del tablero físico (Naranja)
    status: "Desactualizado",
    lastUpdated: "2026-09-15 08:20",
    periodicity: "Corte Semestral",
    description: "Cifras demográficas, mercado laboral e índices socioeconómicos por departamento.",
    recordsCount: 125000,
  },
  {
    id: "saber_pro",
    name: "ICFES - SABER PRO",
    fullName: "Instituto Colombiano para la Evaluación de la Educación",
    category: "Calidad Académica",
    categoryColor: "border-indigo-600", // Color de categoría institucional
    status: "Al día",
    lastUpdated: "2026-10-25 11:15",
    periodicity: "Corte Anual",
    description: "Resultados agregados por competencias genéricas y específicas de graduandos.",
    recordsCount: 38400,
  },
];

export default function DashboardPage() {
  const [sources, setSources] = useState<DataSource[]>(INITIAL_SOURCES);
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

  // Manejador del flujo de actualización mediante la API de Next.js
  const handleUpdateSource = async (source: DataSource) => {
    // 1. Activar spinner en la tarjeta correspondiente
    setUpdatingSources((prev) => ({ ...prev, [source.id]: true }));

    try {
      // 2. Llamar al endpoint de la API
      const response = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceName: source.name }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // 3. Actualizar el estado de la fuente en tiempo real a "Al día"
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

        // Notificación de éxito
        setToast({
          message: `¡${source.name} actualizado con éxito! Pipeline ETL y guías completadas.`,
          type: "success",
        });
      } else {
        throw new Error(data.message || "Error en el servidor");
      }
    } catch (error: any) {
      console.error("Error al actualizar fuente:", error);
      setToast({
        message: `Fallo al actualizar ${source.name}: ${error.message || "No se pudo conectar"}`,
        type: "error",
      });
    } finally {
      // Desactivar spinner
      setUpdatingSources((prev) => ({ ...prev, [source.id]: false }));

      // Auto-ocultar notificación a los 4 segundos
      setTimeout(() => {
        setToast(null);
      }, 4000);
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Toast Notification Flotante */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`px-5 py-3.5 rounded-xl shadow-xl border flex items-center gap-3 text-sm font-medium ${
              toast.type === "success"
                ? "bg-[#0A1C3D] text-white border-emerald-500/40"
                : "bg-red-900 text-white border-red-500"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-[#00A859] shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#FFC000] shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Institucional UNIMINUTO (Azul Marino #0A1C3D) */}
      <header className="bg-[#0A1C3D] text-white shadow-lg border-b-4 border-[#FFC000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo y Título */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                <Database className="w-6 h-6 text-[#FFC000]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#FFC000] bg-white/10 px-2 py-0.5 rounded">
                    CADIT • UNIMINUTO
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00A859] animate-pulse"></span>
                    Sistema Operativo
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white mt-0.5">
                  Data Sources Automation <span className="text-[#FFC000] font-normal">(DSA)</span>
                </h1>
                <p className="text-xs text-slate-300">
                  Panel de Orquestación, Descargas, ETL y Diccionarios de Fuentes Institucionales
                </p>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sources.forEach((s) => {
                    if (s.status !== "Al día") handleUpdateSource(s);
                  });
                }}
                className="bg-[#FFC000] hover:bg-[#E5AC00] text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                title="Actualizar todas las fuentes pendientes"
              >
                <RefreshCw className="w-4 h-4 text-slate-900" />
                <span>Actualizar Pendientes</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Fuentes</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalSources}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Al Día</p>
              <p className="text-2xl font-black text-[#00A859] mt-1">{upToDateCount}</p>
            </div>
            <div className="p-3 bg-emerald-50 text-[#00A859] rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Desactualizadas</p>
              <p className="text-2xl font-black text-amber-700 mt-1">{outdatedCount}</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg border border-amber-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex items-center justify-between">
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
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Input de Búsqueda */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por fuente, categoría o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0A1C3D] focus:bg-white transition-all text-slate-800"
            />
          </div>

          {/* Filtros de Estado */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Estado:
            </span>
            {(["TODOS", "Al día", "Desactualizado", "Fallo"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === filter
                    ? "bg-[#0A1C3D] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter === "TODOS" ? "Todas" : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Tarjetas (Cards) de Fuentes de Datos */}
        {filteredSources.length > 0 ? (
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
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No se encontraron fuentes</h3>
            <p className="text-xs text-slate-500 mt-1">
              Prueba modificando el término de búsqueda o retirando los filtros de estado.
            </p>
          </div>
        )}

        {/* Sección Informativa del Flujo de 5 Pasos del Orquestador */}
        <div className="bg-gradient-to-r from-[#0A1C3D] to-[#152D5E] rounded-2xl p-6 text-white shadow-md border border-white/10">
          <div className="flex items-center gap-2 text-[#FFC000] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            Flujo de Automatización CADIT (5 Pasos)
          </div>
          <h2 className="text-lg font-bold text-white mb-2">
            ¿Qué ocurre al presionar &quot;Actualizar Ahora&quot;?
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl mb-4">
            El dashboard activa el orquestador <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300">orquestador.py</code> que ejecuta el ciclo de vida estandarizado en la estructura de carpetas de cada fuente:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="font-mono text-[#FFC000] font-bold block mb-1">1. Descarga</span>
              <p className="text-slate-300 text-[11px]">
                Descarga el archivo bruto o API a la carpeta <code className="text-white font-mono">Archivos/</code>
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="font-mono text-[#FFC000] font-bold block mb-1">2. ETL</span>
              <p className="text-slate-300 text-[11px]">
                Limpia y valida reglas de negocio en <code className="text-white font-mono">Procesados/</code> y logs en <code className="text-white font-mono">ETL/</code>
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="font-mono text-[#FFC000] font-bold block mb-1">3. Diccionario</span>
              <p className="text-slate-300 text-[11px]">
                Actualiza el catálogo técnico Markdown en <code className="text-white font-mono">Diccionarios/</code>
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="font-mono text-[#FFC000] font-bold block mb-1">4. LEEME</span>
              <p className="text-slate-300 text-[11px]">
                Registra la versión y fecha de sincronización en <code className="text-white font-mono">Guia/LEEME.txt</code>
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/10">
              <span className="font-mono text-[#FFC000] font-bold block mb-1">5. Descripción</span>
              <p className="text-slate-300 text-[11px]">
                Regenera la ficha ejecutiva <code className="text-white font-mono">DESCRIPCION_GENERAL.md</code>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Institucional */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Corporación Universitaria Minuto de Dios - <strong>UNIMINUTO</strong>. Unidad CADIT.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Data Sources Automation (DSA) v1.0</span>
            <span>•</span>
            <span>Next.js 14 + Python Orchestrator</span>
          </div>
        </div>
      </footer>

      {/* Modal para visualizar LEEME.txt o Diccionario.md */}
      <DocumentModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false, type: null, source: null })}
        type={modalConfig.type}
        source={modalConfig.source}
      />
    </div>
  );
}
