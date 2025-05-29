import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UsuarioDocument = Usuario & Document;

export enum RolUsuario {
  USUARIO = 'usuario',
  ADMIN = 'admin',
  MODERADOR = 'moderador',
}

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({
    type: String,
    enum: RolUsuario,
    default: RolUsuario.USUARIO,
  })
  rol: RolUsuario;

  @Prop({ type: String, default: '' })
  imagen?: string; // ✅ Aquí agregas el avatar

  @Prop({ type: Boolean, default: false })
  fromGoogle?: boolean;

  _id: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
