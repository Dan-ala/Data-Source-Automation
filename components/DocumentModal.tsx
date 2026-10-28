"use client";

import React from "react";
import { DataSource } from "@/types/source";
import { X, FileText, BookOpen, ExternalLink, CheckCircle2 } from "lucide-react";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "LEEME" | "DICCIONARIO" | null;
  source: DataSource | null;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  type,
  source,
}) => {
  if (!isOpen || !source || !type) return null;

  const isLeeme = type === "LEEME";
  const title = isLeeme 
    ? `Guía y LEEME: ${source.name}` 
    : `Diccionario de Datos: ${source.name}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="bg-[#0A1C3D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              {isLeeme ? (
                <FileText className="w-5 h-5 text-[#FFC000]" />
              ) : (
                <BookOpen className="w-5 h-5 text-[#FFC000]" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
              <p className="text-xs text-slate-300">
                Ubicación: <code className="bg-white/10 px-1.5 py-0.5 rounded text-amber-300">
                  {isLeeme ? `fuentes/${source.name}/Guia/LEEME.txt` : `fuentes/${source.name}/Diccionarios/DICCIONARIO_${source.name}.md`}
                </code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 bg-slate-50/50">
          {isLeeme ? (
            <div className="space-y-4 font-mono text-xs bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800">
              <div className="text-emerald-400 font-bold border-b border-slate-800 pb-2">
                # CADIT - UNIMINUTO // GUÍA OFICIAL DE FUENTE: {source.name}
              </div>
              <p>
                <strong>Nombre Completo:</strong> {source.fullName}<br />
                <strong>Categoría:</strong> {source.category}<br />
                <strong>Última Sincronización:</strong> {source.lastUpdated}<br />
                <strong>Periodicidad:</strong> {source.periodicity || "Mensual / Semestral"}
              </p>
              <div className="pt-2 text-slate-300">
                <strong>ESTRUCTURA DE CARPETAS DE LA FUENTE:</strong><br />
                ├── Archivos/     - Archivos brutos (CSV/XLSX/PDF descargados)<br />
                ├── Diccionarios/ - Diccionario técnico de variables (.md)<br />
                ├── ETL/          - Scripts Python de transformación y limpieza<br />
                ├── Guia/         - LEEME.txt y DESCRIPCION_GENERAL_{source.name}.md<br />
                └── Procesados/   - Datos consolidados y validados para Power BI / Tableros
              </div>
              <div className="pt-2 text-amber-300">
                [OK] Orquestación configurada para ejecución automática o por demanda.
              </div>
            </div>
          ) : (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00A859]" />
                Metadatos y Variables Registradas
              </h4>
              <p className="text-xs text-slate-500">
                Este diccionario describe los campos homologados resultantes del proceso ETL ejecutado por el orquestador.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Campo</th>
                      <th className="p-2.5">Tipo</th>
                      <th className="p-2.5">Descripción</th>
                      <th className="p-2.5">Ejemplo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-2.5 font-mono font-medium text-slate-900">id_registro</td>
                      <td className="p-2.5">Integer</td>
                      <td className="p-2.5">Identificador único del registro</td>
                      <td className="p-2.5 font-mono">100234</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-medium text-slate-900">periodo_corte</td>
                      <td className="p-2.5">String</td>
                      <td className="p-2.5">Periodo académico o fecha de reporte</td>
                      <td className="p-2.5 font-mono">2026-1</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-medium text-slate-900">sede_uniminuto</td>
                      <td className="p-2.5">String</td>
                      <td className="p-2.5">Sede o centro regional asociado</td>
                      <td className="p-2.5 font-mono">Bogotá Calle 80</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-medium text-slate-900">estado_beneficio</td>
                      <td className="p-2.5">String</td>
                      <td className="p-2.5">Estado clasificado por el ETL</td>
                      <td className="p-2.5 font-mono">Activo / En proceso</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
          >
            Cerrar Vista
          </button>
        </div>
      </div>
    </div>
  );
};
