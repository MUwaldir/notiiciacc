// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { UsuariosModule } from 'src/usuarios/usuarios.module';
// import { JwtModule } from '@nestjs/jwt';

// @Module({
//   imports: [
//     UsuariosModule, // 👈 IMPORTAR AQUÍ
//     JwtModule.register({
//       secret: 'clave_secreta', // usa configService en prod
//       signOptions: { expiresIn: '1d' },
//     }),
//   ],
//   providers: [AuthService],
//   controllers: [AuthController]
// })
// export class AuthModule {}


// auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'; // 👈 necesario
import { JwtStrategy } from './jwt.strategy';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'mi_secreto', // 👈 aquí deberías poner una variable de entorno
      signOptions: { expiresIn: '1d' },
    }),
    UsuariosModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [PassportModule,JwtModule],
})
export class AuthModule {}

