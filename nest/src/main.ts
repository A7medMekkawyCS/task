import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import multer from 'multer';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // JSON + form-urlencoded + multipart form-data (Postman form-data)
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(multer().none());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // One error per field: required OR invalid — not both
      stopAtFirstError: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
