import type { TypeOrmModuleOptions } from "@nestjs/typeorm"

export enum Env {
  DEFAULT = "default",
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export interface IConfigApp {
  port: number
  version: string
}

export interface IClerk {
  apiKey: string
}
export interface IConfig {
  env: Env
  app: IConfigApp
  db: TypeOrmModuleOptions
  clerk: IClerk
}
