import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ComentariosService } from './comentarios.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateComentarioDto } from 'src/dto/create-comentario.dto';
import { Usuario } from 'src/usuarios/schemas/usuario.schema';

// src/comentarios/comentarios.controller.ts
@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async crearComentario(
    @Body() comentarioDto: CreateComentarioDto,
    @CurrentUser() usuario: Usuario,
  ) {
    console.log('BODY:', comentarioDto);
    console.log('TIPO DE noticia:', typeof comentarioDto.noticia);
    return this.comentariosService.crear(comentarioDto, usuario._id);
  }

  @Get(':noticiaId')
  async obtenerComentarios(@Param('noticiaId') noticiaId: string) {
    console.log(noticiaId);
    return this.comentariosService.obtenerPorNoticia(noticiaId);
  }
}
