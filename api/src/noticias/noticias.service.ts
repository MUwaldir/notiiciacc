import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { CreateNoticiaDto } from 'src/dto/create-noticia.dto';
import { v2 as cloudinary } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import * as dotenv from 'dotenv';
import {
  Comentario,
  ComentarioDocument,
} from 'src/comentarios/schemas/comentario.schema';
import { Noticia, NoticiaDocument } from 'src/schemas/noticias.schema';
import { NoticiaConComentarios } from './interfaces/noticia.interface';
import { UpdateNoticiaDto } from 'src/dto/update-noticia.dto';
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
// import { Noticia, NoticiaDocument } from './schemas/noticia.schema';
// import { CreateNoticiaDto } from './dto/create-noticia.dto';

@Injectable()
export class NoticiasService {
  constructor(
    @InjectModel(Noticia.name)
    private readonly noticiaModel: Model<NoticiaDocument>,
    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<ComentarioDocument>,
  ) {}

  async crear(
    createNoticiaDto: CreateNoticiaDto,
    userId: string,
    imagenes?: Express.Multer.File[],
  ): Promise<Noticia> {
    console.log(createNoticiaDto);
    const urls: string[] = [];

    if (imagenes && imagenes.length > 0) {
      for (const imagen of imagenes) {
        const upload = await new Promise<{ secure_url: string }>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { folder: 'noticias' },
              (error, result) => {
                if (error) return reject(error);
                resolve(result as { secure_url: string });
              },
            );
            toStream(imagen.buffer).pipe(uploadStream);
          },
        );

        urls.push(upload.secure_url);
      }

      createNoticiaDto.imagenes = urls;
    }

    return this.noticiaModel.create({ ...createNoticiaDto, autor: userId });
  }

  async obtenerTodas(page = 1, limit = 10, tipo?: string): Promise<any> {
    const skip = (page - 1) * limit;

    const filtro: any = tipo ? { tipo: tipo.toLowerCase() } : {};

    // 1. Obtener las noticias filtradas y paginadas
    const noticias = await this.noticiaModel
      .find(filtro)
      .populate('autor')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const noticiaIds = noticias.map((n) => n._id);

    // 2. Contar comentarios en bloque
    const comentariosPorNoticia = await this.comentarioModel.aggregate([
      { $match: { noticia: { $in: noticiaIds } } },
      { $group: { _id: '$noticia', totalComentarios: { $sum: 1 } } },
    ]);

    // 3. Crear un diccionario { noticiaId: totalComentarios }
    const comentariosDict = comentariosPorNoticia.reduce((acc, item) => {
      acc[item._id.toString()] = item.totalComentarios;
      return acc;
    }, {});

    // 4. Mezclar datos
    const noticiasConComentarios = noticias.map((noticia) => ({
      ...noticia,
      totalComentarios: comentariosDict[noticia._id.toString()] || 0,
    }));

    // 5. Total con filtro
    const totalNoticias = await this.noticiaModel.countDocuments(filtro);

    return {
      data: noticiasConComentarios,
      total: totalNoticias,
      page,
      limit,
    };
  }

  async obtenerTodasNoticiasAdmin() {
    return this.noticiaModel.find().populate('autor').sort({ createdAt: -1 }).lean();
  }

  async obtenerNoticia(id: string): Promise<Noticia> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`El ID '${id}' no es válido`);
    }
    const noticia = await this.noticiaModel
      .findById(id)
      .populate('autor')
      .exec();
    if (!noticia) {
      throw new NotFoundException(`No se encontró una noticia con ID: ${id}`);
    }
    return noticia;
  }

  async obtenerNoticiasPorUsuario(usuarioId: string) {
    const noticias_por_usuario = await this.noticiaModel
      .find({ autor: usuarioId })
      .sort({ createdAt: -1 });
    // console.log(noticias_por_usuario);
    return noticias_por_usuario;
  }

  // noticias.service.ts

  async cambiarEstado(id: string, nuevoEstado: string): Promise<Noticia> {
    const noticia = await this.noticiaModel.findByIdAndUpdate(
      id,
      { estado: nuevoEstado },
      { new: true },
    );
    if (!noticia) {
      throw new NotFoundException('Noticia no encontrada');
    }

    return noticia;
  }

  async eliminarNoticia(id: string): Promise<{ message: string }> {
    await this.noticiaModel.findByIdAndDelete(id);
    return { message: 'Noticia eliminada con éxito' };
  }

  // noticias.service.ts

  async actualizarNoticia(
    id: string,
    updateNoticiaDto: UpdateNoticiaDto,
    usuario: any,
    imagenes?: Express.Multer.File[], // Nuevas imágenes que vienen del form
  ): Promise<Noticia> {
    // 1. Verificar si se encontró la noticia
    const noticia = await this.noticiaModel.findById(id);
    console.log('Noticia encontrada:', noticia); // Depuración: mostrar la noticia encontrada
    if (!noticia) throw new NotFoundException('Noticia no encontrada');
    console.log(usuario)
    // Verificar si el usuario tiene permisos
    const esAdmin = usuario.rol === 'admin';
    const esPropietario = noticia.autor.toString() === usuario._id;
    console.log('Usuario esAdmin:', esAdmin, 'esPropietario:', esPropietario); // Depuración: verificar permisos

    if (!esAdmin && !esPropietario) {
      throw new ForbiddenException(
        'No tienes permiso para editar esta noticia',
      );
    }

    let nuevasUrls: string[] = [];

    // 2. Verificar si existen imágenes nuevas y subirlas
    if (imagenes && imagenes.length > 0) {
      console.log('Imágenes recibidas:', imagenes); // Depuración: mostrar imágenes recibidas
      nuevasUrls = await Promise.all(
        imagenes.map(async (imagen) => {
          console.log('Procesando imagen:', imagen.originalname); // Depuración: mostrar nombre de cada imagen
          const upload = await new Promise<{ secure_url: string }>(
            (resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'noticias' },
                (error, result) => {
                  if (error) {
                    console.error('Error subiendo imagen:', error); // Depuración: mostrar error al subir imagen
                    return reject(error);
                  }
                  console.log('Imagen subida con éxito:', result); // Depuración: mostrar resultado de subida
                  resolve(result as { secure_url: string });
                },
              );
              toStream(imagen.buffer).pipe(uploadStream);
            },
          );
          return upload.secure_url;
        }),
      );
      console.log('URLs de imágenes nuevas:', nuevasUrls); // Depuración: mostrar URLs subidas
    }

    // const imagenesExistentes = Array.isArray(
    //   updateNoticiaDto.imagenesExistentes,
    // )
    //   ? updateNoticiaDto.imagenesExistentes
    //   : JSON.parse(updateNoticiaDto.imagenesExistentes || '[]');
    // 3. Asegurarse de que imagenesExistentes sea un array válido
    const imagenesExistentes: string[] = Array.isArray(
      updateNoticiaDto.imagenesExistentes,
    )
      ? updateNoticiaDto.imagenesExistentes.filter(
          (url): url is string => !!url,
        )
      : (noticia.imagenes ?? []);
    console.log('Imágenes existentes:', imagenesExistentes); // Depuración: mostrar imágenes existentes

    // 4. Combinar imágenes existentes y nuevas
    const imagenesFinales = [
      ...new Set([...imagenesExistentes, ...nuevasUrls]),
    ];
    console.log('Imágenes finales:', imagenesFinales); // Depuración: mostrar imágenes combinadas

    // 5. Actualizar la noticia
    noticia.imagenes = imagenesFinales;

    // Actualizar otros campos
    noticia.titulo = updateNoticiaDto.titulo ?? noticia.titulo;
    noticia.contenido = updateNoticiaDto.contenido ?? noticia.contenido;
    noticia.tipo = updateNoticiaDto.tipo ?? noticia.tipo;
    noticia.ubicacion = updateNoticiaDto.ubicacion ?? noticia.ubicacion;

    if (esAdmin && updateNoticiaDto.estado) {
      noticia.estado = updateNoticiaDto.estado;
    }

    // 6. Guardar la noticia actualizada
    console.log('Noticia a guardar:', noticia); // Depuración: mostrar la noticia antes de guardar
    await noticia.save();

    return noticia;
  }

  async toggleConfirmacion(noticiaId: string, usuarioId: string) {
    const noticia = await this.noticiaModel.findById(noticiaId);
    if (!noticia) throw new NotFoundException('Noticia no encontrada');

    const userObjectId = new Types.ObjectId(usuarioId);
    const index = noticia.confirmaciones.findIndex((id) =>
      id.equals(userObjectId),
    );

    if (index >= 0) {
      // Ya ha confirmado, quitar confirmación
      noticia.confirmaciones.splice(index, 1);
    } else {
      // No ha confirmado, agregar confirmación
      noticia.confirmaciones.push(userObjectId);
    }

    await noticia.save();
    return noticia;
  }
}
