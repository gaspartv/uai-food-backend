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
import { EnvService } from '../../config/env/service.env'
import { UsersService } from '../../modules/users/users.service'
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

    if (!requirePasswordCheck) return true

    await this.validate(this.extract(context.switchToHttp().getRequest()))

    return true
  }

  async validate(data: { sub: string; password: string }): Promise<void> {
    const user = await this.usersService.findUserById(this.prisma, data.sub, {
      deletedAt: null,
      disabledAt: null
    })

    const passwordValid = await compare(data.password, user.password_hash)

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials.')
    }
  }

  extract(req: any) {
    try {
      if (!req.user.sign.sub || !req.body.password) {
        throw new UnauthorizedException('Invalid token.')
      }
      return { sub: req.user.sign.sub, password: req.body.password }
    } catch (error) {
      console.error(error)
      throw new ConflictException('Invalid credentials.')
    }
  }
}
