import { verifyToken } from "@clerk/backend"
import { type CanActivate, type ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { Reflector } from "@nestjs/core"
import type { Request } from "express"
import { IS_PUBLIC_KEY } from "../decorators/public.decorator"

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private static readonly AUTH_HEADER = "authorization"
  private static readonly SESSION_COOKIE = "__session"

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      await this.attachUserIfTokenExists(req)
      return true
    }

    const token = this.extractToken(req)
    if (!token) {
      throw new UnauthorizedException("Missing or malformed token")
    }

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

  private extractToken(req: Request): string | undefined {
    const authHeader = req.headers[ClerkAuthGuard.AUTH_HEADER]?.split(" ")[1]
    const sessionCookie = req.cookies[ClerkAuthGuard.SESSION_COOKIE]
    return authHeader || sessionCookie
  }

  private async attachUserIfTokenExists(req: Request): Promise<void> {
    const token = this.extractToken(req)
    if (token) {
      try {
        const session = await verifyToken(token, {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          secretKey: process.env.CLERK_SECRET_KEY!,
        })
        req["user"] = session.public_metadata
      } catch (err) {
        console.error("Token verification failed for public route:", err)
      }
    }
  }
}
