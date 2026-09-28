import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import {
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { AuthModule } from './auth/auth.module';
import { I18nHttpExceptionFilter } from './common/filters/http-exception.filter';
import { SecretKeyGuard } from './common/guards/secret-key.guard';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');

        if (!uri) {
          throw new Error('MONGODB_URI is not defined');
        }

        return {
          uri,
        };
      },
    }),

    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        // Compiled app reads from dist/i18n (copied via nest-cli assets).
        // watch:false avoids ENOENT spam while deleteOutDir clears dist on rebuild.
        path: join(__dirname, 'i18n'),
        watch: false,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver(['lang']),
      ],
    }),
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SecretKeyGuard,
    },
    {
      provide: APP_FILTER,
      useClass: I18nHttpExceptionFilter,
    },
  ],
})
export class AppModule {}
