import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { VersioningType } from '@nestjs/common'
import { AppModule } from './app/app.module'
import type { IConfigApp } from './common/interfaces/common.interface'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  app.setGlobalPrefix('api')
  //* CONFIG
  const { port, version } = config.getOrThrow<IConfigApp>('app')
  //* VERSIONING
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: version, prefix: 'v' })
  //* START
  await app.listen(port || 3000, '0.0.0.0')
}
bootstrap()
