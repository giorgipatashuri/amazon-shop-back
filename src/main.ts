import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors()
  app.setGlobalPrefix("api")
  await app.listen(8888);
}
bootstrap(); 
