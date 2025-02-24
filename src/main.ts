import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET, POST, OPTIONS, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
