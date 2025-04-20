import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm'
import { configuration } from '../config/configuration'
import { UserModule } from '../api/user/user.module'
import { HealthModule } from '../modules/health-check/health.module'
import { AxiosModule } from '@/modules/axios/axios.module'
import { LoggerModule } from '@/modules/logger/logger.module'
import { AppInterceptor } from '@/common/interceptors/app.interceptor'
import { APP_INTERCEPTOR } from '@nestjs/core'

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
    AxiosModule,
    LoggerModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: AppInterceptor }],
})
export class AppModule {}
