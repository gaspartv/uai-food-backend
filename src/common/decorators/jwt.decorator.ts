import { UseGuards, applyDecorators } from '@nestjs/common'
import { JwtGuard } from '../guards/jwt.guard'

export function JwtAuth() {
  return applyDecorators(UseGuards(JwtGuard))
}
