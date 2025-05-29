import { IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto {
    @IsOptional()
    @IsString()
    nombre?: string;
  }
  