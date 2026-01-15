export interface Usuario {
  _id?: string;
  nombre_completo: string;
  email: string;
  password?: string;
  rol: 'Admin' | 'Profesor' | 'Alumno'; // Capitalized based on typical enum usage, but checking backend would be better. Assuming strings for now.
  fecha_registro?: Date;
}

export interface Curso {
  _id?: string;
  nombre_curso: string;
  descripcion: string;
  anio: number;
}

export interface Matricula {
  _id?: string;
  id_usuario: string | Usuario;
  id_curso: string | Curso;
  fecha_matricula?: Date;
}

export interface Encuesta {
  _id?: string;
  titulo: string;
  descripcion: string;
  fecha_creacion?: Date;
  es_anonima: boolean;
  creador?: string | Usuario;
}

export interface Opcion {
  _id?: string;
  texto_opcion: string;
}

export interface Pregunta {
  _id?: string;
  id_encuesta: string;
  texto_pregunta: string;
  tipo: 'seleccion_unica' | 'texto' | 'valoracion'; // Adjusting types to guess, but will stick to generic strings if unsure
  opciones?: Opcion[];
}

export interface AsignacionEncuesta {
  _id?: string;
  id_encuesta: string | Encuesta;
  id_usuario?: string | Usuario;
  id_curso?: string | Curso;
  fecha_asignacion?: Date;
  fecha_limite?: Date;
  completada: boolean;
}
