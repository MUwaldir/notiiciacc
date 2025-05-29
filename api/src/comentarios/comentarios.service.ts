import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario, ComentarioDocument } from './schemas/comentario.schema';
import { Model, Types } from 'mongoose';
import { CreateComentarioDto } from 'src/dto/create-comentario.dto';

// src/comentarios/comentarios.service.ts
@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name)
    private comentarioModel: Model<ComentarioDocument>,
  ) {}
  // src/comentarios/comentarios.service.ts
  async crear(dto: CreateComentarioDto, userId: string): Promise<Comentario> {
    const nuevoComentario = new this.comentarioModel({
      contenido: dto.contenido,
      noticia: new Types.ObjectId(dto.noticia), // ya es un ID
      autor: userId, // del token
    });
    return nuevoComentario.save();
  }

  async obtenerPorNoticia(noticiaId: string) {
    const noticiaObjectId = new Types.ObjectId(noticiaId); // Convertir a ObjectId
    return this.comentarioModel
      .find({ noticia: noticiaObjectId })
      .populate('autor', 'nombre imagen') // traer autor con nombre y avatar
      .sort({ createdAt: -1 });
  }
}
