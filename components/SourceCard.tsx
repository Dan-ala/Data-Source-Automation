"use client";

import React from "react";
import { DataSource, SourceStatus } from "@/types/source";
import { 
  RefreshCw, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calendar,
  FolderOpen
} from "lucide-react";

interface SourceCardProps {
  source: DataSource;
  isUpdating: boolean;
  onUpdate: (source: DataSource) => void;
  onViewDoc?: (type: "LEEME" | "DICCIONARIO", source: DataSource) => void;
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#00A859] border border-[#00A859]/30 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00A859]" />
            Al día
          </span>
        );
      case "Desactualizado":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-[#FFC000] shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Desactualizado
          </span>
        );
      case "Fallo":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#E30613] border border-[#E30613]/30 shadow-xs">
            <XCircle className="w-3.5 h-3.5 text-[#E30613]" />
            Fallo
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/80 border-t-4 ${source.categoryColor} flex flex-col justify-between overflow-hidden group`}
    >
      {/* Contenido Superior de la Tarjeta */}
      <div className="p-6">
        {/* Cabecera: Categoría y Badge de Estado */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
            {source.category}
          </span>
          {renderStatusBadge(source.status)}
        </div>

        {/* Título y Nombre Completo */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-uniminuto-navy transition-colors">
            {source.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1" title={source.fullName}>
            {source.fullName}
          </p>
        </div>

        {/* Descripción breve (si existe) */}
        {source.description && (
          <p className="text-xs text-slate-600 mb-4 line-clamp-2">
            {source.description}
          </p>
        )}

        {/* Metadata: Fecha de última actualización y periodicidad */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <div className="flex items-center text-xs text-slate-600">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            <span className="font-medium text-slate-500 mr-1">Última actualización:</span>
            <span className="font-semibold text-slate-700">{source.lastUpdated}</span>
          </div>

          {source.periodicity && (
            <div className="flex items-center text-xs text-slate-600">
              <FolderOpen className="w-4 h-4 mr-2 text-slate-400" />
              <span className="font-medium text-slate-500 mr-1">Frecuencia:</span>
              <span className="text-slate-700">{source.periodicity}</span>
            </div>
          )}
        </div>
      </div>

      {/* Acciones y Botones */}
      <div className="p-6 pt-0 bg-white space-y-3">
        {/* Botón Principal: Actualizar Ahora con Amarillo UNIMINUTO */}
        <button
          onClick={() => onUpdate(source)}
          disabled={isUpdating}
          className="w-full bg-[#FFC000] hover:bg-[#E5AC00] active:scale-[0.99] text-slate-950 font-bold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
          title={`Ejecutar actualización y orquestación para ${source.name}`}
        >
          <RefreshCw 
            className={`w-4 h-4 ${isUpdating ? "animate-spin text-slate-900" : "text-slate-800"}`} 
          />
          <span>{isUpdating ? "Actualizando fuente..." : "Actualizar Ahora"}</span>
        </button>

        {/* Enlaces Secundarios: Ver LEEME y Ver Diccionario */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onViewDoc ? onViewDoc("LEEME", source) : null}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
            title="Consultar archivo LEEME.txt y Guía institucional"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Ver LEEME</span>
          </button>

          <button
            type="button"
            onClick={() => onViewDoc ? onViewDoc("DICCIONARIO", source) : null}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
            title="Consultar Diccionario de Datos (.md)"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Ver Diccionario</span>
          </button>
        </div>
      </div>
    </div>
  );
};
