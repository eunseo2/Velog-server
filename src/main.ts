import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import config from './config';
const PORT = Number(process.env.PORT);

if (!PORT) {
  throw new Error('Missing');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const CLIENT_HOST = config.CLIENT_HOST;

  app.enableCors({
    origin: `${CLIENT_HOST}`,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(cookieParser());

  await app.listen(PORT, () => console.log(`${PORT}포트 서버 돌아가는 중  `));
}
bootstrap();
