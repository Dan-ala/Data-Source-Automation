export type SourceStatus = "Al día" | "Desactualizado" | "Fallo";

export interface ProductoEstado {
  clave: string;
  corte_descargado: string | null;
  corte_disponible: string | null;
  ultima_verificacion: string | null;
  proxima_verificacion: string | null;
  frecuencia_publicacion?: string | null;
  estado: string; // "al_dia" | "datos_nuevos" | "vencida" | "fallida" | "sin_descarga"
  nota?: string | null;
}

export interface UltimoErrorVerificacion {
  error: string;
  fecha: string;
}

export interface DataSource {
  id: string;
  name: string;
  fullName: string;
  category: string;
  categoryColor: string; // Color Tailwind para el acento de tarjeta
  status: SourceStatus;
  lastUpdated: string;
  periodicity?: string;
  description?: string;
  recordsCount?: number;
  filesCount?: number;
  hasDiccionario?: boolean;
  hasLeeme?: boolean;
  subPath?: string;
  estadoDetalle?: string;
  productos?: ProductoEstado[];
  ultimoErrorVerificacion?: UltimoErrorVerificacion | null;
  esquemaVersion?: number | null;
  tieneEstadoJson?: boolean;
}

