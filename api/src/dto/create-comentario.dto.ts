// src/comentarios/dto/create-comentario.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

// src/dto/create-comentario.dto.ts
export class CreateComentarioDto {
    @IsString()
    @IsNotEmpty()
    contenido: string;
  
    @IsString()
    @IsNotEmpty()
    noticia: string; // Esto llega del frontend
  }
  