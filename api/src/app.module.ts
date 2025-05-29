import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/tasks.module';
import { ItemsModule } from './items/items.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { NoticiasModule } from './noticias/noticias.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { UbicacionModule } from './ubicacion/ubicacion.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { ModeracionModule } from './moderacion/moderacion.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/tasksdb'),
    ConfigModule.forRoot({
      isGlobal: true, // hace que esté disponible en todos los módulos
    }),
    AuthModule,
    TaskModule,
    ItemsModule,
    UsuariosModule,
    NoticiasModule,
    ComentariosModule,
    UbicacionModule,
    NotificacionesModule,
    ModeracionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
