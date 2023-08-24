import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import { IsPublic } from '../../common/decorators/is-public.decorator'
import { Sign } from '../../common/decorators/sign.decorator'
import { MessageDto } from '../../common/dto/message.dto'
import { ISign } from '../../common/interfaces/payload.interface'
import { IRequest } from '../../common/interfaces/request.interface'
import { PrismaService } from '../../config/prisma/prisma.service'
import { AuthService } from './auth.service'
import { LocalAuth } from './decorators/auth-local.decorator'
import { ResponseTokenDto } from './dto/auth-response.dto'
import { AuthLoginResponseMapper } from './mappers/auth-login.response.mapper'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}

  @IsPublic()
  @LocalAuth()
  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: IRequest): Promise<ResponseTokenDto> {
    const { token } = await this.prisma.$transaction(async (tx) => {
      return await this.authService.login(tx, req.user)
    })

    return plainToInstance(ResponseTokenDto, AuthLoginResponseMapper(token))
  }

  @Delete()
  async logout(@Sign() sign: ISign): Promise<MessageDto> {
    await this.prisma.$transaction(async (tx) => {
      return await this.authService.logout(tx, sign.sub)
    })

    return plainToInstance(MessageDto, { message: 'Logout successfully' })
  }
}
