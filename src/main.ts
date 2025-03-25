import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

import { RequestHeader } from './persistent/enums';
import { AppConfigFactory } from './common/config/providers/app-config.factory';
import { ServerConfigFactory } from './common/config/providers/server-config.factory';
import { ContextService } from './common/context/context.service';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { ExceptionFilter } from './common/filters/exception.filter';
import { SerializerInterceptor } from './common/interceptors/serializer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
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

  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();
  app.enableCors({ origin: serverConfig.getCorsOrigin(), credentials: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ExceptionFilter(app.get(ContextService)));
  app.useGlobalInterceptors(new SerializerInterceptor(app.get(Reflector), app.get(ContextService)));

  await app.listen(serverConfig.getPort());
}

void bootstrap();
