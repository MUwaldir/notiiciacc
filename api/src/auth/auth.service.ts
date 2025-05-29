// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsuarioDocument } from 'src/usuarios/schemas/usuario.schema';

import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {
  private oauth2Client: OAuth2Client;
  constructor(
    private usersService: UsuariosService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.oauth2Client = new OAuth2Client(this.configService.get<string>('GOOGLE_CLIENT_ID'));
  }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email) as UsuarioDocument;
  
    if (!user) {
      throw new UnauthorizedException('Correo o contraseña incorrecta');
    }
  
    if (user.fromGoogle) {
      throw new UnauthorizedException('Por favor, inicia sesión con Google');
    }
  
    if (!user.password || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Correo o contraseña incorrecta');
    }
  
    const payload = { email: user.email,rol: user.rol, sub: user._id };
  
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        imagen: user.imagen
      }
    };
  }
  


  async loginWithGoogle(idToken: string) {
    const ticket = await this.oauth2Client.verifyIdToken({
      idToken,
      audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    });
  
    const payload = ticket.getPayload();
  
    if (!payload || !payload.email) {
      throw new UnauthorizedException('Token de Google inválido');
    }
  
    const email = payload.email;
  
    // Buscar al usuario por correo
    let user = await this.usersService.findOne(email);
  
  // Si el usuario no existe, crear uno nuevo
  if (!user) {
    // Asegurarse de que 'payload.name' no sea undefined
    const nombre = payload.name || ''; // Asignar valor predeterminado si es undefined

    user = await this.usersService.create({
      nombre, // Usamos 'nombre' mapeado de 'name' de Google
      email,
      imagen: payload.picture,
      fromGoogle: true,  // Indicamos que es un registro desde Google
    });
  }
  
    // Generar el token JWT
    const token = this.jwtService.sign({ email: user.email,rol: user.rol, sub: user._id });
  
    // Devolver el token y los datos del usuario
    return {
      access_token: token,
      user: {
        id: user._id,
        nombre: user.nombre, // Usamos 'nombre' ya que es el campo en la base de datos
        email: user.email,
        rol: user.rol,
        imagen: user.imagen
      }
    };
  }
  
 


  // async getUserFromToken(token: string) {
  //   try {
  //     // Decodificar el token para extraer el email
  //     const decoded: any = this.jwtService.decode(token);
  //     const email = decoded.email; // Suponiendo que el email está en el payload del token

  //     // Obtener el usuario usando el email extraído
  //     const user = await this.usersService.encontrarPorEmail(email);
  //     if (!user) {
  //       throw new Error('Usuario no encontrado');
  //     }

  //     return user;
  //   } catch (error) {
  //     throw new Error('Token inválido');
  //   }
  // }
}
