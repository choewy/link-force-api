import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

import { RequestHeader } from './persistent/enums';
import { AppConfigFactory } from './common/config/providers/app-config.factory';
import { ServerConfigFactory } from './common/config/providers/server-config.factory';
import { ExceptionFilter } from './common/filter/exception.filter';
import { ContextService } from './common/context/context.service';
import { SerializerInterceptor } from './common/interceptor/serializer.interceptor';

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
  app.enableCors({ origin: serverConfig.getCorsOrigin(), credentials: true });
  app.useGlobalInterceptors(new SerializerInterceptor(app.get(Reflector), app.get(ContextService)));
  app.useGlobalFilters(new ExceptionFilter(app.get(ContextService)));
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
