import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Headers,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { AuthService } from '../auth/auth.service'; // Asegúrate de importar el servicio de Auth
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Usuario } from './schemas/usuario.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUsuarioDto } from 'src/dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    // private readonly authService: AuthService, // Asegúrate de tener el servicio de autenticación
  ) {}

  @Get()
  async findAll() {
    return this.usuariosService.findAllUsers();
  }

  @Post('registro')
  async registrarUsuario(
    @Body('nombre') nombre: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usuariosService.crearUsuario(nombre, email, password);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  async obtenerPerfil(@CurrentUser() usuario: Usuario) {
    // El usuario ya está disponible directamente a través del decorador
    console.log(usuario);
    if (!usuario) {
      throw new Error('Usuario no autenticado');
    }
    // Llamar al servicio para obtener los datos completos del usuario utilizando su ID
    const usuarioCompleto = await this.usuariosService.obtenerUsuarioPorId(
      usuario._id,
    );

    if (!usuarioCompleto) {
      throw new Error('Usuario no encontrado');
    }

    return usuarioCompleto;
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('imagen'))
  async actualizarPerfil(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateUsuarioDto
  ) {
    console.log(id ,": " , body," :", file)
    return this.usuariosService.update(id, body, file);
  }
  @Get(':email')
  async obtenerUsuario(@Param('email') email: string) {
    return this.usuariosService.encontrarPorEmail(email);
  }
}
