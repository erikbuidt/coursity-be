import { Env, type IConfig } from "@/common/interfaces/common.interface"
import { cleanEnv, num, str } from "envalid"
export type ConfigApp = IConfig
export const configuration = (): ConfigApp => {
  const configEnvValidate = cleanEnv(process.env, {
    NODE_ENV: str({ default: Env.PRODUCTION, choices: Object.values(Env) }),
    APP_PORT: num({}),
    APP_VERSION: str({ default: "1" }),
    DB_HOST: str({ default: "localhost" }),
    DB_PORT: num({ default: 5432 }),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    CLERK_API_KEY: str(),
    CLERK_PUBLISHABLE_KEY: str(),
    CLERK_SECRET_KEY: str(),
  })
  return {
    env: configEnvValidate.NODE_ENV,
    app: {
      port: configEnvValidate.APP_PORT,
      version: configEnvValidate.APP_VERSION,
    },
    clerk: {
      apiKey: configEnvValidate.CLERK_API_KEY,
      publishableKey: configEnvValidate.CLERK_PUBLISHABLE_KEY,
      secretKey: configEnvValidate.CLERK_SECRET_KEY,
    },
    db: {
      type: "postgres",
      host: configEnvValidate.DB_HOST,
      port: configEnvValidate.DB_PORT,
      username: configEnvValidate.DB_USER,
      password: configEnvValidate.DB_PASSWORD,
      database: configEnvValidate.DB_NAME,
      synchronize: true,
      logging: true,
      entities: ["dist/**/*.entity{.ts,.js}"],
    },
  }
}
