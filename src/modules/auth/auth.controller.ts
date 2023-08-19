import { Controller, HttpCode, HttpStatus, Post, Request } from '@nestjs/common'
import { IsPublic } from '../../common/decorators/is-public.decorator'
import { AuthService } from './auth.service'
import { LocalAuth } from './decorators/auth-local.decorator'
import { ResponseAuthDto } from './dto/auth-response.dto'
import { IAuthRequest } from './interfaces/auth-request.interface'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @LocalAuth()
  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: IAuthRequest): Promise<ResponseAuthDto> {
    return this.authService.login(req.user)
  }
}
