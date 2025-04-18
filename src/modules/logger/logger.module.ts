import { LoggerModule as PinoModule } from 'nestjs-pino'
import { Global, Module } from '@nestjs/common'
import { loggerConfig } from './logger.config'

@Global()
@Module({
  imports: [PinoModule.forRootAsync(loggerConfig)], // Ensure loggerConfig is imported correctly
})
export class LoggerModule {}
