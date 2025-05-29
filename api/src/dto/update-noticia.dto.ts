import { IsString, IsOptional, IsArray, IsUrl, IsEnum, ArrayNotEmpty } from 'class-validator';

export class UpdateNoticiaDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  contenido?: string;

  // Si las imágenes son enviadas, se espera un array de URLs de las imágenes existentes o nuevas
  @IsOptional()
  imagenesExistentes?: string; // Aquí se espera un array de URLs

  // Si se suben nuevas imágenes, el backend las recibe como archivos, pero en el DTO puedes manejarlas
  @IsOptional()
  @IsArray()
  imagenes?: Express.Multer.File[];

  @IsOptional()
  @IsEnum(['pendiente', 'aprobada', 'rechazada', 'suspendida'])
  estado?: string;

  @IsOptional()
  @IsEnum(['accidente', 'bloqueo', 'clima', 'obras', 'otro'])
  tipo: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;
}
