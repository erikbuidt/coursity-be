// biome-ignore lint/style/useImportType: <explanation>
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { verifyToken } from "@clerk/backend"
import type { Request } from "express"
@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const authHeader = req.headers["authorization"]
    const sessionCookie = req.cookies["__session"]
    if (!authHeader?.startsWith("Bearer ") && !sessionCookie) {
      throw new UnauthorizedException("Missing or malformed token")
    }

    const token = authHeader?.split(" ")[1] || sessionCookie

    try {
      const session = await verifyToken(token, {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        secretKey: process.env.CLERK_SECRET_KEY!,
      })
      if (!session) {
        throw new UnauthorizedException("Invalid token")
      }
      req["user"] = session.public_metadata
      return true
    } catch (err) {
      console.error("Token verification failed:", err)
      throw new UnauthorizedException("Invalid Clerk token")
    }
  }
}
