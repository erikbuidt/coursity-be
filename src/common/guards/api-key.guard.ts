// biome-ignore lint/style/useImportType: <explanation>
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const apiKey = request.headers["apikey"]
    if (!apiKey) {
      return false
    }
    console.log("API_KEY", apiKey)
    console.log("CLERK_API_KEY", process.env.CLERK_API_KEY)
    return apiKey === process.env.CLERK_API_KEY
  }
}
