import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { map, type Observable } from 'rxjs'
import type { Request, Response } from 'express'
interface IApiPassedRes<T> {
  status: number
  code: string
  data: T
}
export class AppInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IApiPassedRes<T> | Promise<Observable<IApiPassedRes<T>>>> {
    const ctx = context.switchToHttp()
    const req = ctx.getRequest<Request & { id: string }>()
    const res = ctx.getResponse<Response>()
    res.header('x-request-id', req.id)
    return next.handle().pipe(map((data: T) => this.formatResponse(data as T)))
  }

  private formatResponse(data: T): IApiPassedRes<T> {
    return { status: 200, code: '000', data: data }
  }
}
