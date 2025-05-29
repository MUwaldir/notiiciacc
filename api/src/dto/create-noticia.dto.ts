import { IsNotEmpty, IsString, IsArray, IsOptional, IsEnum } from 'class-validator';

export class CreateNoticiaDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  contenido: string;

  @IsArray()
  @IsOptional()
  imagenes?: string[];

  @IsOptional()
  @IsEnum(['pendiente', 'aprobada', 'rechazada', 'suspendida'])
  estado?: string; // Por defecto será "aprobada" si no lo envía

  @IsNotEmpty()
  @IsEnum(['accidente', 'bloqueo', 'clima', 'obras', 'otro'])
  tipo: string;

  @IsNotEmpty()
  @IsString()
  ubicacion: string;
}
