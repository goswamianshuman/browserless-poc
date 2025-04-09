import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') ?? 8000;

  const config = new DocumentBuilder()
    .setTitle('Food Delivery Backend')
    .setDescription('API docs for authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT);
  console.log(`
    \x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m
    \x1b[32m🚀🚀🚀       FOOD DELIVERY BACKEND API STARTED       🚀🚀🚀\x1b[0m
    \x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m
    🌍  \x1b[1mServer is running at:\x1b[0m \x1b[4mhttp://localhost:${PORT}\x1b[0m
    💡  Use Ctrl+C to stop the server
    \x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m
    `);
}
bootstrap();
