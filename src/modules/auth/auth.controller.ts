import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { FastifyReply } from 'fastify'
import { IsPublic } from '../../common/decorators/is-public.decorator'
import { MessageDto } from '../../common/dto/message.dto'
import { AuthService } from './auth.service'
import { LocalAuth } from './decorators/auth-local.decorator'
import { Sign } from './decorators/auth-sign.decorator'
import { ResponseTokenDto } from './dto/auth-response.dto'
import { ISign } from './interfaces/auth-payload.interface'
import { IAuthRequest } from './interfaces/auth-request.interface'
import { AuthLoginResponseMapper } from './mappers/auth-login.response.mapper'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly authService: AuthService
  ) {}

  @IsPublic()
  @LocalAuth()
  @Post()
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: IAuthRequest,
    @Res({ passthrough: true }) res: FastifyReply
  ): Promise<ResponseTokenDto> {
    const { token } = await this.prisma.$transaction(async (tx) => {
      return await this.authService.login(tx, req.user)
    })

    res.setCookie('refreshToken', token)

    return AuthLoginResponseMapper(token)
  }

  @Delete()
  async logout(@Sign() sign: ISign): Promise<MessageDto> {
    await this.authService.logout()

    return { message: 'Logout successfully' }
  }
}
