export type TipoMateria = 'A' | 'B'; // A = Simple, B = Con Secciones

export type ModoCalculo = 'simple' | 'ponderado';

export type NotaMinimaOpcion = '4' | '6' | '7' | 'custom';

export interface Examen {
  id: string;
  nombre: string;
  peso?: number; // 0-100 (solo para ponderado)
  nota?: number; // 0-10 (opcional, undefined/null para pendientes)
  esRequisito?: boolean;
  notaRequisitoMinima?: number; // Ej: 4
}

export interface Seccion {
  id: string;
  nombre: string;
  peso: number; // Peso de la sección en la nota final (0-100)
  modo: ModoCalculo;
  examenes: Examen[];
}

export interface Materia {
  id: string;
  nombre: string;
  tipo: TipoMateria;
  notaMinimaRef: NotaMinimaOpcion;
  notaMinimaCustom?: number; // 1-10
  modo: ModoCalculo; // Para Tipo A
  examenes: Examen[]; // Para Tipo A
  secciones: Seccion[]; // Para Tipo B
}
