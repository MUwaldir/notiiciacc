import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Noticia, NoticiaSchema } from 'src/schemas/noticias.schema';

import { NoticiasService } from './noticias.service';
import { NoticiasController } from './noticias.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ComentariosModule } from 'src/comentarios/comentarios.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Noticia.name, schema: NoticiaSchema }]),
    AuthModule,ComentariosModule
  ],
  controllers: [NoticiasController],
  providers: [NoticiasService],
})
export class NoticiasModule {}
