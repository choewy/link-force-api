import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { ServerConfigFactory } from './config/providers/server-config.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = app.get(ServerConfigFactory);

  app.enableCors({ origin: serverConfig.getCorsOrigin() });
  app.enableShutdownHooks();

  await app.listen(serverConfig.getListenPort());
}

void bootstrap();
