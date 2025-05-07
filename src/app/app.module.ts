import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule, type TypeOrmModuleOptions } from "@nestjs/typeorm"
import { configuration } from "../config/configuration"
import { UserModule } from "../api/user/user.module"
import { HealthModule } from "../modules/health-check/health.module"
import { AxiosModule } from "@/modules/axios/axios.module"
import { LoggerModule } from "@/modules/logger/logger.module"
import { AppInterceptor } from "@/common/interceptors/app.interceptor"
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core"
import { ClerkClientProvider } from "@/common/providers/clerk-client.provider"
import { FileModule } from "@/api/file/file.module"
import { CourseModule } from "@/api/course/course.module"
import { LessonModule } from "@/api/lesson/lesson.module"
import { LearningModule } from "@/api/learning/learning.module"
import { EnrollmentService } from "@/api/enrollment/enrollment.service"
import { EnrollmentModule } from "@/api/enrollment/enrollment.module"
import { ClerkAuthGuard } from "@/common/guards/clerk.guard"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: [".env"],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        ...config.get<TypeOrmModuleOptions>("db"),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    HealthModule,
    AxiosModule,
    LoggerModule,
    // FileModule,
    CourseModule,
    LessonModule,
    LearningModule,
    EnrollmentModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: AppInterceptor },
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule {}
