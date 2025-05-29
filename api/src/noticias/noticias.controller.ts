import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Patch,
  Delete,
  Put,
  UploadedFiles,
  Req,
  Query,
} from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { CreateNoticiaDto } from 'src/dto/create-noticia.dto';
import { Noticia } from 'src/schemas/noticias.schema';
import { v2 as cloudinary } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import * as dotenv from 'dotenv';

import { Usuario } from 'src/usuarios/schemas/usuario.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateNoticiaDto } from 'src/dto/update-noticia.dto';

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

@Controller('noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('imagenes', 5))
  @UseGuards(JwtAuthGuard)
  async crearNoticia(
    @Body() createNoticiaDto: CreateNoticiaDto,
    @CurrentUser() usuario: Usuario,
    @UploadedFiles() imagenes?: Express.Multer.File[],
  ): Promise<Noticia> {
    console.log(createNoticiaDto);
    return this.noticiasService.crear(createNoticiaDto, usuario._id, imagenes);
  }

  @Get()
  async obtenerNoticias(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('tipo') tipo?: string, // 👈 agregamos este nuevo query param
  ): Promise<Noticia[]> {
    console.log(page,limit,tipo)
    return this.noticiasService.obtenerTodas(page, limit, tipo);
  }
  @Get('admin')
  async obtenerNoticiasAdmin(
   
  ): Promise<Noticia[]> {
  
    return this.noticiasService.obtenerTodasNoticiasAdmin();
  }
  
  @Get('usuario')
  @UseGuards(JwtAuthGuard)
  async obtenerNoticiasDelUsuario(@CurrentUser() usuario: Usuario) {
    // console.log('usuario que quier su noticia:', usuario);
    return this.noticiasService.obtenerNoticiasPorUsuario(usuario._id);
  }
  @Get(':id')
  async obtenerNoticia(@Param('id') id: string): Promise<Noticia> {
    return this.noticiasService.obtenerNoticia(id);
  }

  @Patch(':id/aprobar')
  @UseGuards(JwtAuthGuard)
  async aprobarNoticia(@Param('id') id: string): Promise<Noticia> {
    return this.noticiasService.cambiarEstado(id, 'aprobada');
  }

  @Patch(':id/rechazar')
  @UseGuards(JwtAuthGuard)
  async rechazarNoticia(@Param('id') id: string): Promise<Noticia> {
    return this.noticiasService.cambiarEstado(id, 'rechazada');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async eliminarNoticia(@Param('id') id: string): Promise<{ message: string }> {
    return this.noticiasService.eliminarNoticia(id);
  }

  // noticias.controller.ts
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('imagenes', 5)) // Limitar a 5 imágenes
  async actualizar(
    @Param('id') id: string,
    @Body() updateNoticiaDto: UpdateNoticiaDto, // Idealmen                                                                                                                                                                                                                                                  te usa un DTO como UpdateNoticiaDto
    @CurrentUser() usuario: Usuario,
    @UploadedFiles() imagenes?: Express.Multer.File[], // Recepción de imágenes
  ): Promise<any> {
    // Cambié el tipo de retorno a any para solo verificar los datos
    // Verifica que los datos llegan correctamente
    console.log('ID:', id);
    console.log('UpdateNoticiaDto:', updateNoticiaDto); // Imprime los datos recibidos del cuerpo
    console.log('Imágenes:', imagenes); // Imprime las imágenes que se están enviando
    // Verificar si imagenesExistentes es una cadena y convertirla en un array
    // En el controlador o servicio donde se procesa el DTO:

    // console.log('Imagenes Existentes:', imagenesExistentes);
    // No llamamos al servicio, solo retornamos lo recibido para hacer la prueba
    return this.noticiasService.actualizarNoticia(
      id,
      updateNoticiaDto,
      usuario,
      imagenes,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/confirmar')
  async confirmacionToggle(@Param('id') id: string, @Req() req: any) {
    const usuarioId = req.user._id;

    const noticiaActualizada = await this.noticiasService.toggleConfirmacion(
      id,
      usuarioId,
    );

    return {
      totalConfirmaciones: noticiaActualizada.confirmaciones.length,
      confirmado: noticiaActualizada.confirmaciones.some((userId) =>
        userId.equals(usuarioId),
      ),
    };
  }
}
