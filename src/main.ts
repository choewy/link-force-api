import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { AppConfigFactory } from './config/providers/app-config.factory';
import { ServerConfigFactory } from './config/providers/server-config.factory';
import { RequestHeader } from './persistent/enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigFactory);
  const serverConfig = app.get(ServerConfigFactory);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(appConfig.getAppName())
    .setVersion(appConfig.getAppVersion())
    .addBearerAuth({ name: RequestHeader.AccessToken, type: 'http', in: 'header' }, RequestHeader.AccessToken)
    .addApiKey({ name: RequestHeader.RefreshToken, type: 'apiKey', in: 'header' }, RequestHeader.RefreshToken)
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, swaggerDocument);

  app.enableShutdownHooks();
  app.enableCors({
    origin: serverConfig.getCorsOrigin(),
    credentials: true,
  });

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      enableCircularCheck: true,
      enableImplicitConversion: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableCircularCheck: true,
        enableImplicitConversion: true,
      },
      exceptionFactory(errors) {
        const error = errors.shift();
        const constraints = error?.constraints ?? {};
        const message = Object.values(constraints).shift() ?? '';

        throw new BadRequestException(message);
      },
    }),
  );

  await app.listen(serverConfig.getPort());
}

void bootstrap();
