import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // origin: 'http://localhost:5173', // permite solo el frontend local
    origin: '*',
    credentials: true, // permite el uso de cookies, headers de auth, etc.
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // ⚠️ Esto es clave para que los datos en FormData se transformen correctamente
      forbidNonWhitelisted: true
    }),
  );
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
