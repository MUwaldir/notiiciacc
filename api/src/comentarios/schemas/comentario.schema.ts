// src/comentarios/schemas/comentario.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Noticia } from 'src/schemas/noticias.schema';
import { Usuario } from 'src/usuarios/schemas/usuario.schema';

export type ComentarioDocument = Comentario & Document;

@Schema({ timestamps: true, collection: 'comentarios' })
export class Comentario {
  @Prop({ required: true })
  contenido: string;

  @Prop({ type: Types.ObjectId, ref: Noticia.name, required: true })
  noticia: Types.ObjectId | Noticia;

  @Prop({ type: Types.ObjectId, ref: Usuario.name, required: true })
  autor: Types.ObjectId | Usuario;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
