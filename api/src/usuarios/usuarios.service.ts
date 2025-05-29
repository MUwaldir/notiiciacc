import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';
import * as bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import * as dotenv from 'dotenv';

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>) {}


  findAllUsers() {
    return this.usuarioModel.find();
  }

  async findOne(email: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ email }).exec();
  }

  async crearUsuario(nombre: string, email: string, password: string): Promise<Usuario> {
     // Verificar si el correo electrónico ya existe
     const usuarioExistente = await this.usuarioModel.findOne({ email });
     if (usuarioExistente) {
       throw new ConflictException('El correo electrónico ya está registrado');
     }
    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = new this.usuarioModel({ nombre, email, password: hashedPassword });
    try {
      return await usuario.save();  // Intentar guardar el usuario
    } catch (error) {
      if (error.code === 11000) {
        // Este es un error de clave duplicada (por ejemplo, el email ya existe)
        throw new ConflictException('El correo electrónico ya está registrado');
      }
      // Si ocurre otro tipo de error
      throw new InternalServerErrorException('Error al crear el usuario. Intenta más tarde.');
    }
  }

  async encontrarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ email }).exec();
  }

  async update(id: string, body: any, file?: Express.Multer.File) {
    let imageUrl = null;

    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'usuarios' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        toStream(file.buffer).pipe(uploadStream);
      });

      imageUrl = (result as any).secure_url;
    }

    const updateData: any = { ...body };
    if (imageUrl) updateData.imagen = imageUrl;
    console.log(updateData)

    return await this.usuarioModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async obtenerUsuarioPorId(id: string): Promise<Usuario> {
    // Convertir el string ID a ObjectId
    const objectId =new  Types.ObjectId(id);

    // Buscar el usuario por su ObjectId en la base de datos
    const usuario = await this.usuarioModel.findById(objectId).exec();
    
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.encontrarPorEmail(email);
  }

  async create(data: { email: string;nombre: string; imagen?: string; fromGoogle?: boolean }): Promise<Usuario> {
    const { email, nombre, imagen, fromGoogle } = data;
  
    // Verificar si el correo ya existe
    const usuarioExistente = await this.usuarioModel.findOne({ email });
    if (usuarioExistente) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
  
    // Crear un nuevo usuario
    const usuario = new this.usuarioModel({
      email,
      nombre: nombre,
      imagen: imagen || null,  // Si no se recibe avatar, asignar null
      fromGoogle: fromGoogle || false,  // Si no se recibe fromGoogle, asignar false
    });
  
    try {
      // Intentar guardar el usuario
      return await usuario.save();
    } catch (error) {
      // Manejar errores de forma más detallada
      if (error.code === 11000) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
      throw new InternalServerErrorException('Error al crear el usuario desde Google: ' + error.message);
    }
  }
  
  
}

