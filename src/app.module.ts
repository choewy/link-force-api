import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigFactoryModule } from './config/config-factory.module';
import { TypeOrmConfigFactory } from './config/providers/typeorm-config.factory';

import { AuthModule } from './application/auth/auth.module';
import { LinkModule } from './application/link/link.module';

@Module({
  imports: [
    ConfigFactoryModule,
    TypeOrmModule.forRootAsync({
      inject: [TypeOrmConfigFactory],
      useFactory(typeOrmConfigFactory: TypeOrmConfigFactory) {
        return typeOrmConfigFactory.getTypeOrmModuleOptions();
      },
    }),
    AuthModule,
    LinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
