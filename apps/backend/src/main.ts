import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvironmentService } from './modules/common/environment/environment.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvironmentService);

  const allowedOrigin = envService.get('FRONTEND_URL');

  app.enableCors({
    origin: [allowedOrigin],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('Real Estate App API')
    .setDescription('API documentation for the Real Estate Application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  

  const port = envService.get('PORT');

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📚 Swagger documentation is available at: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();
