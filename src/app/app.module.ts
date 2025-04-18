import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm'
import { configuration } from '../config/configuration'
import { UserModule } from '../api/user/user.module'
import { HealthModule } from '../modules/health-check/health.module'

import { LoggerModule } from '../modules/logger/logger.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env'],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get<TypeOrmModuleOptions>('db'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    HealthModule,
    LoggerModule, // Ensure LoggerModule is imported here
  ],
})
export class AppModule {}
