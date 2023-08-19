import { UseGuards, applyDecorators } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/auth-jwt.guard'

export function JwtAuth() {
  return applyDecorators(UseGuards(JwtAuthGuard))
}
