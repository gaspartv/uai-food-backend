import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { ISign } from '../interfaces/auth-payload.interface'
import { IJwtRequest } from '../interfaces/jwt-request.interface'

export const Sign = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ISign => {
    const request = context.switchToHttp().getRequest<IJwtRequest>()

    return request.user.sign
  }
)
