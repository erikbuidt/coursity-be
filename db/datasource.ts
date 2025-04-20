import { ConfigService } from '@nestjs/config'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from 'dotenv'

config()
const configService = new ConfigService()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  synchronize: false, // Ensure this is false for migrations
  logging: false,
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`], // Update the path for migrations
  migrationsTableName: 'migrations',
})
