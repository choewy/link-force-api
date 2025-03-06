import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import { AppConfigFactory } from './config/providers/app-config.factor';
import { ServerConfigFactory } from './config/providers/server-config.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigFactory);
  const serverConfig = app.get(ServerConfigFactory);

  const swaggerConfig = new DocumentBuilder().setTitle(appConfig.getAppName()).setVersion(appConfig.getAppVersion()).build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, swaggerDocument);

  app.enableCors({ origin: serverConfig.getCorsOrigin() });
  app.enableShutdownHooks();

  await app.listen(serverConfig.getListenPort());
}

void bootstrap();
