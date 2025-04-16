import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Глобальная валидация (добавлено)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,            // Автоматическое преобразование типов
      disableErrorMessages: false, // Показывать сообщения об ошибках
      whitelist: true,            // Удаляет лишние поля
      forbidNonWhitelisted: true   // Возвращает ошибку при лишних полях
    })
  );

  await app.listen(3000);
}

bootstrap();
