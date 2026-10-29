export type SourceStatus = "Al día" | "Desactualizado" | "Fallo";

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
}
