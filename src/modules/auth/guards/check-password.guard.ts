import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'
import { EnvService } from '../../../config/env/service.env'
import { UsersService } from '../../users/users.service'
import { IS_PASSWORD_CHECK_REQUIRED } from '../decorators/check-password.decorator'

@Injectable()
export class CheckPasswordGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private envService: EnvService,
    private usersService: UsersService,
    private prisma: PrismaClient
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirePasswordCheck = this.reflector.getAllAndOverride<boolean>(
      IS_PASSWORD_CHECK_REQUIRED,
      [context.getHandler(), context.getClass()]
    )

    if (!requirePasswordCheck) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    const data = this.extract(request)

    await this.validate(data)

    return true
  }

  async validate(data: { sub: string; password: string }): Promise<void> {
    const { password, sub } = data

    const user = await this.usersService.findUserByIdOrThrow(this.prisma, sub, {
      deletedAt: null,
      disabledAt: null
    })

    const isPasswordValid = await compare(password, user.password_hash)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Login or password incorrect.')
    }
  }

  extract(request: any) {
    try {
      if (!request.user.sign.sub || !request.body.password) {
        throw new Error()
      }

      return { sub: request.user.sign.sub, password: request.body.password }
    } catch (error) {
      if (this.envService.isDevelopment()) {
        console.log(error)
      }

      throw new ConflictException('Invalid credentials')
    }
  }
}
