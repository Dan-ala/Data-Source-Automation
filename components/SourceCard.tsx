"use client";

import React from "react";
import { DataSource, SourceStatus, ProductoEstado } from "@/types/source";
import { 
  RefreshCw, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calendar,
  FolderOpen,
  Files
} from "lucide-react";

interface SourceCardProps {
  source: DataSource;
  isUpdating: boolean;
  onUpdate: (source: DataSource) => void;
  onViewDoc?: (type: "LEEME" | "DICCIONARIO", source: DataSource) => void;
}

const CATEGORY_TAG_STYLES: Record<string, string> = {
  "Educación": "bg-blue-50 text-blue-700 border-blue-200",
  "Rosado": "bg-pink-50 text-pink-700 border-pink-200",
  "Verde": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Rojo": "bg-rose-50 text-rose-700 border-rose-200",
  "Naranja": "bg-orange-50 text-orange-700 border-orange-200",
  "Celeste": "bg-sky-50 text-sky-700 border-sky-200",
};

const NOMBRES_PRODUCTOS: Record<string, string> = {
  movilidad_saliente: "Movilidad saliente",
  movilidad_entrante: "Movilidad entrante",
  salarios_saliente: "Salarios saliente",
  salarios_entrante: "Salarios entrante",
};

const PRODUCT_DOT_COLOR: Record<string, string> = {
  al_dia: "bg-emerald-500",
  datos_nuevos: "bg-blue-500",
  vencida: "bg-amber-500",
  fallida: "bg-red-500",
  sin_descarga: "bg-slate-400",
};

const PRODUCT_STATUS_LABEL: Record<string, string> = {
  al_dia: "Al día",
  datos_nuevos: "Datos nuevos",
  vencida: "Vencida",
  fallida: "Fallida",
  sin_descarga: "Sin descarga",
};

function formatFechaBogota(isoString?: string | null): string {
  if (!isoString) return "N/D";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export const SourceCard: React.FC<SourceCardProps> = ({
  source,
  isUpdating,
  onUpdate,
  onViewDoc,
}) => {
  // Función auxiliar para renderizar el badge de estado según las directrices institucionales
  const renderStatusBadge = (status: SourceStatus) => {
    switch (status) {
      case "Al día":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Al día
          </span>
        );
      case "Desactualizado":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-cadit-yellow shadow-2xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Desactualizado
          </span>
        );
      case "Fallo":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-300 shadow-2xs">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Fallo
          </span>
        );
      default:
        return null;
    }
  };

  // Función para renderizar el badge global (priorizando estadoDetalle cuando existe estado.json)
  const renderGlobalStatusBadge = () => {
    if (source.estadoDetalle) {
      switch (source.estadoDetalle) {
        case "al_dia":
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Al día
            </span>
          );
        case "datos_nuevos":
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Datos nuevos
            </span>
          );
        case "vencida":
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Verificación vencida
            </span>
          );
        case "fallida":
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-300 shadow-2xs">
              <XCircle className="w-3.5 h-3.5 text-red-600" />
              Verificación fallida
            </span>
          );
        case "sin_descarga":
        default:
          return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              Sin descarga
            </span>
          );
      }
    }
    return renderStatusBadge(source.status);
  };

  const tieneEstadoDedicado = Boolean(
    source.tieneEstadoJson || (source.productos && source.productos.length > 0)
  );

  return (
    <div 
      className={`relative bg-white rounded-xl shadow-xs hover:shadow-md transition-all duration-300 border border-slate-200/90 border-t-4 ${source.categoryColor || "border-cadit-blue"} flex flex-col justify-between overflow-hidden group`}
    >
      {/* Contenido Superior de la Tarjeta */}
      <div className="p-6">
        {/* Cabecera: Categoría y Badge de Estado */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded border ${CATEGORY_TAG_STYLES[source.category] || "text-cadit-navy/70 bg-cadit-fog border-slate-200"}`}>
            {source.category}
          </span>
          {renderGlobalStatusBadge()}
        </div>

        {/* Título y Nombre Completo */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-cadit-navy tracking-tight group-hover:text-cadit-blue transition-colors">
            {source.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1" title={source.fullName}>
            {source.fullName}
          </p>
        </div>

        {/* Descripción breve */}
        {source.description && (
          <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
            {source.description}
          </p>
        )}

        {/* Metadata: Fecha de última actualización, periodicidad y archivos */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <div className="flex items-center text-xs text-slate-600">
            <Calendar className="w-3.5 h-3.5 mr-2 text-cadit-blue" />
            <span className="font-medium text-slate-500 mr-1">Última modificación:</span>
            <span className="font-semibold text-cadit-navy">{source.lastUpdated}</span>
          </div>

          {source.periodicity && (
            <div className="flex items-center text-xs text-slate-600">
              <FolderOpen className="w-3.5 h-3.5 mr-2 text-cadit-blue" />
              <span className="font-medium text-slate-500 mr-1">Frecuencia:</span>
              <span className="text-slate-700">{source.periodicity}</span>
            </div>
          )}

          {source.filesCount !== undefined && source.filesCount > 0 && (
            <div className="flex items-center text-xs text-slate-600">
              <Files className="w-3.5 h-3.5 mr-2 text-cadit-blue" />
              <span className="font-medium text-slate-500 mr-1">Archivos en repositorio:</span>
              <span className="font-semibold text-cadit-blue">{source.filesCount} elementos</span>
            </div>
          )}
        </div>

        {/* Regla 5: Lista compacta de productos cuando existe estado.json */}
        {source.productos && source.productos.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-cadit-navy/90">
                Productos Oficiales ({source.productos.length})
              </h4>
            </div>

            <div className="space-y-2">
              {source.productos.map((prod: ProductoEstado) => {
                const nombre = NOMBRES_PRODUCTOS[prod.clave] || prod.clave;
                const dotColor = PRODUCT_DOT_COLOR[prod.estado] || "bg-slate-400";
                const estadoTxt = PRODUCT_STATUS_LABEL[prod.estado] || prod.estado;

                return (
                  <div 
                    key={prod.clave} 
                    className="p-2.5 bg-slate-50/90 rounded-lg border border-slate-200/90 text-xs text-slate-700 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 font-semibold text-cadit-navy">
                        <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
                        <span>{nombre}</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {estadoTxt}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-2 gap-y-0.5">
                      <span>
                        <strong className="font-medium text-slate-500">Corte:</strong> Desc. {prod.corte_descargado ?? "Ninguno"} | Disp. {prod.corte_disponible ?? (prod.nota ? "No verificado" : "N/D")}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 flex flex-wrap gap-x-2 gap-y-0.5">
                      <span>
                        <strong className="font-medium">Últ. verif:</strong> {formatFechaBogota(prod.ultima_verificacion)}
                      </span>
                      <span>•</span>
                      <span>
                        <strong className="font-medium">Próx:</strong> {formatFechaBogota(prod.proxima_verificacion)}
                      </span>
                      {prod.frecuencia_publicacion && (
                        <>
                          <span>•</span>
                          <span>Frecuencia estimada: {prod.frecuencia_publicacion}</span>
                        </>
                      )}
                    </div>

                    {prod.nota && (
                      <span className="text-[10px] text-slate-500 italic block pt-0.5">
                        Nota: {prod.nota}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Aviso discreto si existe ultimoErrorVerificacion */}
            {source.ultimoErrorVerificacion && (
              <div className="mt-3 p-2.5 bg-amber-50/90 border border-amber-200/90 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold block text-[11px]">Último aviso de verificación:</span>
                  <p className="text-[11px] leading-snug text-amber-800">{source.ultimoErrorVerificacion.error}</p>
                  <span className="text-[10px] text-amber-700 block">
                    Fecha: {formatFechaBogota(source.ultimoErrorVerificacion.fecha)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Acciones y Botones */}
      <div className="p-6 pt-0 bg-white space-y-3">
        {/* Regla 6: Botón deshabilitado para fuentes con estado.json / extractor dedicado */}
        {tieneEstadoDedicado ? (
          <button
            type="button"
            disabled
            className="w-full bg-slate-100 text-slate-400 border border-slate-200 font-semibold py-2.5 px-4 rounded-lg cursor-not-allowed text-xs flex items-center justify-center gap-2 select-none"
            title="Esta fuente cuenta con un extractor oficial dedicado y se ejecuta desde extractores/ole (consola o GUI)"
          >
            <span>Se ejecuta desde extractores/ole</span>
          </button>
        ) : (
          /* Botón Principal para las demás 35 fuentes */
          <button
            onClick={() => onUpdate(source)}
            disabled={isUpdating}
            className="w-full bg-cadit-yellow hover:bg-cadit-ochre active:scale-[0.99] text-cadit-navy font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-xs flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
            title={`Ejecutar actualización y orquestación para ${source.name}`}
          >
            <RefreshCw 
              className={`w-4 h-4 ${isUpdating ? "animate-spin text-cadit-navy" : "text-cadit-navy"}`} 
            />
            <span>{isUpdating ? "Actualizando fuente..." : "Sincronizar Fuente"}</span>
          </button>
        )}

        {/* Enlaces Secundarios: Ver LEEME y Ver Diccionario */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onViewDoc ? onViewDoc("LEEME", source) : null}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-cadit-navy bg-cadit-fog hover:bg-slate-200/80 border border-slate-200 rounded-md transition-colors"
            title="Consultar archivo LEEME.txt y Guía institucional en modo lectura"
          >
            <FileText className="w-3.5 h-3.5 text-cadit-blue" />
            <span>Ver LEEME</span>
          </button>

          <button
            type="button"
            onClick={() => onViewDoc ? onViewDoc("DICCIONARIO", source) : null}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-cadit-navy bg-cadit-fog hover:bg-slate-200/80 border border-slate-200 rounded-md transition-colors"
            title="Consultar Diccionario de Datos (.md) en modo lectura"
          >
            <BookOpen className="w-3.5 h-3.5 text-cadit-blue" />
            <span>Ver Diccionario</span>
          </button>
        </div>
      </div>
    </div>
  );
};
