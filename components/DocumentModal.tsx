"use client";

import React, { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DataSource } from "@/types/source";
import { 
  X, 
  FileText, 
  BookOpen, 
  Loader2, 
  AlertCircle, 
  Copy, 
  Check, 
  Eye, 
  Code2, 
  Search,
  ExternalLink,
  Table as TableIcon
} from "lucide-react";

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
  const [content, setContent] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"formatted" | "raw">("formatted");
  const [copied, setCopied] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (!isOpen || !source || !type) {
      setContent(null);
      setError(null);
      setSearchTerm("");
      setActiveTab("formatted");
      return;
    }

    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/doc?source=${encodeURIComponent(source.id)}&type=${type}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setContent(data.content || "(El archivo está vacío)");
          setFilename(data.folder || data.filename);
        } else {
          setError(data.error || "No se pudo cargar el documento.");
        }
      } catch (err: any) {
        setError(err.message || "Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [isOpen, source, type]);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtrado o resaltado básico si se busca un término en modo raw
  const displayContent = useMemo(() => {
    return content || "";
  }, [content]);

  if (!isOpen || !source || !type) return null;

  const isLeeme = type === "LEEME";
  const title = isLeeme 
    ? `Guía Operativa / LEEME: ${source.name}` 
    : `Diccionario y Catálogo de Datos: ${source.name}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-cadit-navy/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header Oficial CADIT UNIMINUTO */}
        <div className="bg-cadit-blue text-white px-6 py-4 flex items-center justify-between border-b-4 border-cadit-yellow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl text-cadit-yellow border border-white/10 shrink-0">
              {isLeeme ? (
                <FileText className="w-5 h-5 text-cadit-yellow" />
              ) : (
                <BookOpen className="w-5 h-5 text-cadit-yellow" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold tracking-widest bg-cadit-yellow text-cadit-navy px-1.5 py-0.5 rounded shadow-2xs">
                  CADIT
                </span>
                <h3 className="text-base font-bold tracking-tight text-white">{title}</h3>
              </div>
              <p className="text-xs text-white/80 mt-0.5 truncate max-w-xl">
                Ruta activa: <code className="bg-cadit-navy/40 px-1.5 py-0.5 rounded text-cadit-yellow text-[11px] font-mono">
                  FUENTES_T/{source.subPath || source.name}/{filename || (isLeeme ? "Guia/LEEME.txt" : "Diccionarios/...")}
                </code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!content || loading}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold rounded-lg text-white border border-white/20 transition-all disabled:opacity-50"
              title="Copiar texto completo al portapapeles"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cadit-yellow" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Barra de Navegación del Visor (Tabs: Vista Enriquecida vs Raw + Búsqueda) */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Tabs Selector */}
          <div className="flex items-center gap-1 bg-cadit-fog p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab("formatted")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === "formatted"
                  ? "bg-cadit-navy text-white shadow-xs"
                  : "text-slate-600 hover:text-cadit-navy hover:bg-white/50"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Vista Enriquecida (MD)</span>
            </button>

            <button
              onClick={() => setActiveTab("raw")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                activeTab === "raw"
                  ? "bg-cadit-navy text-white shadow-xs"
                  : "text-slate-600 hover:text-cadit-navy hover:bg-white/50"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Texto Original / Raw</span>
            </button>
          </div>

          {/* Badge informativo de formateo */}
          <div className="flex items-center gap-2 text-slate-500">
            <TableIcon className="w-3.5 h-3.5 text-cadit-blue" />
            <span className="text-[11px]">
              Tablas de variables, tipos de datos y descripciones formateadas automáticamente.
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-cadit-navy bg-cadit-fog flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-3">
              <Loader2 className="w-9 h-9 animate-spin text-cadit-blue" />
              <p className="text-xs font-semibold text-cadit-navy">
                Procesando y dando formato al documento...
              </p>
              <p className="text-[11px] text-slate-400">
                Extrayendo tablas y catálogos de variables
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 p-5 rounded-xl flex items-start gap-3 text-xs">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Documento no disponible</p>
                <p className="mt-1">{error}</p>
                <p className="mt-2 text-slate-500">
                  Verifica que la fuente cuente con los archivos en las carpetas <code>Guia/</code> o <code>Diccionarios/</code>.
                </p>
              </div>
            </div>
          ) : activeTab === "formatted" ? (
            /* Vista Enriquecida Markdown con soporte GFM y diseño CADIT */
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200/90 shadow-2xs max-w-none text-slate-800 leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Titulares
                  h1: ({ node, ...props }) => (
                    <div className="border-b-2 border-cadit-yellow pb-2.5 mb-5 mt-2">
                      <h1 className="text-xl sm:text-2xl font-bold text-cadit-navy flex items-center gap-2" {...props} />
                    </div>
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-base sm:text-lg font-bold text-cadit-blue mt-7 mb-3 flex items-center gap-2 border-l-4 border-cadit-blue pl-2.5" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-sm font-bold text-cadit-navy mt-5 mb-2" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mt-4 mb-2" {...props} />
                  ),
                  
                  // Párrafos
                  p: ({ node, ...props }) => (
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3.5" {...props} />
                  ),

                  // Separadores
                  hr: ({ node, ...props }) => (
                    <hr className="my-6 border-slate-200" {...props} />
                  ),

                  // Tablas del Diccionario de Datos
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-5 rounded-xl border border-slate-200 shadow-2xs bg-white">
                      <table className="w-full text-left text-xs border-collapse" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-cadit-navy text-white text-[11px] uppercase tracking-wider font-semibold border-b-2 border-cadit-yellow" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="p-3 font-semibold text-white whitespace-nowrap bg-cadit-navy" {...props} />
                  ),
                  tbody: ({ node, ...props }) => (
                    <tbody className="divide-y divide-slate-100 bg-white" {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="hover:bg-blue-50/50 transition-colors even:bg-slate-50/50" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="p-3 text-slate-700 align-top leading-normal text-xs" {...props} />
                  ),

                  // Código y bloques
                  code: ({ node, inline, className, children, ...props }: any) => {
                    if (inline) {
                      return (
                        <code className="font-mono text-[11px] bg-slate-100 text-cadit-blue font-bold px-1.5 py-0.5 rounded border border-slate-200" {...props}>
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code className="font-mono text-xs text-slate-100 block" {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: ({ node, ...props }) => (
                    <pre className="bg-cadit-navy text-slate-100 p-4 rounded-xl my-4 shadow-inner overflow-x-auto border border-slate-800 font-mono text-xs leading-relaxed" {...props} />
                  ),

                  // Citas / Callouts
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-cadit-blue bg-blue-50/60 p-3.5 rounded-r-lg text-slate-700 italic my-4 text-xs" {...props} />
                  ),

                  // Enlaces
                  a: ({ node, ...props }) => (
                    <a 
                      className="text-cadit-light-blue hover:text-cadit-blue underline font-medium inline-flex items-center gap-1" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      {...props} 
                    />
                  ),

                  // Listas
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside space-y-1.5 my-3 text-xs sm:text-sm text-slate-700 pl-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside space-y-1.5 my-3 text-xs sm:text-sm text-slate-700 pl-2" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="leading-relaxed" {...props} />
                  ),
                }}
              >
                {displayContent}
              </ReactMarkdown>
            </div>
          ) : (
            /* Vista Texto Plano / Raw */
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-800 max-h-[65vh] overflow-y-auto">
              {displayContent}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Origen: Repositorio OEDE - VAC (Solo Lectura)</span>
            <span>•</span>
            <span>Unidad CADIT UNIMINUTO</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-cadit-navy text-xs font-semibold rounded-lg transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-cadit-navy hover:bg-cadit-shadow-blue text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cerrar Vista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
