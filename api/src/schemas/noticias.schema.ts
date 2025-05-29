import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Usuario } from 'src/usuarios/schemas/usuario.schema';

export type NoticiaDocument = Noticia & Document;

@Schema({ timestamps: true })
export class Noticia {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  contenido: string;

  @Prop({ type: [String], default: [] }) // <--- aquí
  imagenes: string[];

  @Prop({
    type: String,
    enum: ['pendiente', 'aprobada', 'rechazada', 'suspendida'],
    default: 'aprobada',
  })
  estado: string;

  @Prop({ type: Types.ObjectId, ref: Usuario.name })
  autor: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: Usuario.name }], default: [] })
  confirmaciones: Types.ObjectId[];

  @Prop({
    type: String,
    enum: ['accidente', 'bloqueo', 'clima', 'obras', 'otro'],
    default: 'otro',
    required: true,
  })
  tipo: string;
  @Prop({ required: true,default: 'Desconocida', })
  ubicacion: string;

}

export const NoticiaSchema = SchemaFactory.createForClass(Noticia);
