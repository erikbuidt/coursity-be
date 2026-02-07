import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
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
import { ServeStaticModule } from "@nestjs/serve-static"
import { EnrollmentModule } from "@/api/enrollment/enrollment.module"
import { ClerkAuthGuard } from "@/common/guards/clerk.guard"
import { FFmpegModule } from "@/modules/ffmpeg/ffmpeg.module"
import { ChapterModule } from "@/api/chapter/chapter.module"
import { join } from "node:path"
import { InstructorModule } from "@/api/instructor/instructor.module"
import { PermitModule } from "@/modules/permit-io/permit.module"
import { PrismaModule } from "@/modules/prisma/prisma.module"

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "..", "hls_output"),
      serveRoot: "/hls",
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: [".env"],
      load: [configuration],
    }),
    PrismaModule,
    UserModule,
    HealthModule,
    AxiosModule,
    LoggerModule,
    FileModule,
    CourseModule,
    LessonModule,
    LearningModule,
    EnrollmentModule,
    FFmpegModule,
    ChapterModule,
    InstructorModule,
    PermitModule,
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
