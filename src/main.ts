import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestMethod, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });

  app.setGlobalPrefix('api/v1', { exclude: [{ path: '', method: RequestMethod.ALL }]});
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Swagger
  const swaggerTitle = 'OmniMind';
  const swaggerPath = `api/doc`;

  const swaggerConfig = new DocumentBuilder()
    .setTitle(swaggerTitle)
    .setDescription('OmniMind is a centralized backend service designed to manage multiple projects with a shared authentication system, modular architecture, and scalable infrastructure.')
    .setContact(
      'René Kemalandua',
      'http://afonsokemalandua-portfolio.vercel.app',
      'kemalanduar@gmail.com',
    )
    .addServer('http://localhost:3000', 'Development')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerPath, app, swaggerDocument);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
