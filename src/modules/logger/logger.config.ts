import { ConfigService } from '@nestjs/config'
import type { LoggerModuleAsyncParams } from 'nestjs-pino'
import type { Request } from 'express'
export const loggerConfig: LoggerModuleAsyncParams = {
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    console.log('tes')
    const { version } = config.get('app')
    return {
      pinoHttp: {
        useLevel: 'info',
        level: config.get('env') === 'production' ? 'info' : config.get('env') === 'development' ? 'info' : 'debug',
        redact: ['req.headers.authorization', 'req.headers.cookie', 'body.password'],
        autoLogging: {
          ignore: (req) =>
            (req as unknown as Request).originalUrl === `/api/${version}/healthcheck` ||
            (req as unknown as Request).originalUrl.startsWith(`/api/${version}/docs`),
        },
      },
      forRoutes: ['*path'],
      exclude: [
        `/api/${version}/healthcheck`,
        `/api/${version}/docs`,
        `/api/${version}/docs/swagger-ui-init.js`,
        `/api/${version}/docs/swagger-ui.css`,
        `/api/${version}/docs/swagger-ui-bundle.js`,
        `/api/${version}/docs/swagger-ui-standalone-preset.js`,
        `/api/${version}/docs/favicon-32x32.png`,
      ],
    }
  },
}
