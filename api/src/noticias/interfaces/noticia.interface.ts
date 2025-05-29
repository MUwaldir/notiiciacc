import { Types } from 'mongoose';

export interface Noticia {
  _id: Types.ObjectId;
  titulo: string;
  contenido: string;
  imagenes: string[];  // Array de strings (URL de imágenes)
  estado: 'pendiente' | 'aprobada' | 'rechazada';  // Enum con los posibles valores
  autor: Types.ObjectId;  // Referencia al usuario
  likes: Types.ObjectId[];  // Array de referencias a usuarios (likes)
  createdAt: Date;  // Fecha de creación (Mongoose lo maneja automáticamente con timestamps)
  updatedAt: Date;  // Fecha de actualización (también gestionado por timestamps)
}

export interface NoticiaConComentarios extends Noticia {
  totalComentarios: number;  // Este campo es agregado a la interfaz extendida
}
