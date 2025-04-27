import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const origins = (process.env.USERS_ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(o => !!o);

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('User Service')
    .setDescription('API for user management')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  await app.listen(process.env.USERS_PORT || 3000);
}
bootstrap();
