import type { IAppError } from './interface.error'

export type CommonCode = 'FORBIDDEN_ROLE'
export type UserCode = 'USER_NOT_FOUND'
export type AppCode = CommonCode | UserCode

export const APP_ERROR: Record<AppCode, IAppError> = {
  FORBIDDEN_ROLE: {
    code: '0004',
    status: 403,
    message: 'You do not have permission to access this resource',
  },
  USER_NOT_FOUND: {
    code: '0001',
    status: 404,
    message: 'User not found',
  },
}
