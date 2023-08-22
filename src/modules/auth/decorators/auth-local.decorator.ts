import { UseGuards, applyDecorators } from '@nestjs/common'
import { LocalAuthGuard } from '../guards/auth-local.guard'

export function LocalAuth() {
  return applyDecorators(UseGuards(LocalAuthGuard))
}
