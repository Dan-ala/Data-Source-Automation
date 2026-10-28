export type SourceStatus = "Al día" | "Desactualizado" | "Fallo";

export interface DataSource {
  id: string;
  name: string;
  fullName: string;
  category: string;
  categoryColor: string; // Color Tailwind para el borde superior (ej. 'border-pink-500', 'border-orange-500')
  status: SourceStatus;
  lastUpdated: string;
  periodicity?: string;
  description?: string;
  recordsCount?: number;
}
