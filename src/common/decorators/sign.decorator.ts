import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IJwtRequest } from '../interfaces/jwt-request.interface'
import { ISign } from '../interfaces/payload.interface'

export const Sign = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ISign => {
    const request = context.switchToHttp().getRequest<IJwtRequest>()

    return request.user.sign
  }
)
