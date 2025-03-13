import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ContextModule } from './common/context/context.module';
import { ConfigFactoryModule } from './common/config/config-factory.module';
import { TypeOrmConfigFactory } from './common/config/providers/typeorm-config.factory';

import { AuthModule } from './common/auth/auth.module';
import { LinkModule } from './application/link/link.module';
import { SignModule } from './application/sign/sign.module';

@Module({
  imports: [
    ContextModule,
    ConfigFactoryModule,
    TypeOrmModule.forRootAsync({
      inject: [TypeOrmConfigFactory],
      useFactory(typeOrmConfigFactory: TypeOrmConfigFactory) {
        return typeOrmConfigFactory.getTypeOrmModuleOptions();
      },
    }),
    AuthModule,
    SignModule,
    LinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
