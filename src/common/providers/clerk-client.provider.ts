import { createClerkClient } from "@clerk/backend"
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from "@nestjs/config"

export const ClerkClientProvider = {
  provide: "CLERK_CLIENT",
  useFactory: (configService: ConfigService) => {
    return createClerkClient({
      publishableKey: configService.get("clerk").publishableKey,
      secretKey: configService.get("clerk").secretKey,
    })
  },
  inject: [ConfigService],
}
