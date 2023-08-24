import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { IPayload } from '../../common/interfaces/payload.interface'
import { PrismaClientTransaction } from '../../config/prisma/prisma.interface'
import { PrismaService } from '../../config/prisma/prisma.service'
import { expiresAtGenerator } from '../../utils/expires-generator.utils'
import { SessionsService } from '../sessions/sessions.service'
import {
  UserEntity,
  UserWithNotRelationsEntity
} from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { ResponseTokenDto } from './dto/auth-response.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService
  ) {}

  async login(
    tx: PrismaClientTransaction,
    user: UserWithNotRelationsEntity
  ): Promise<ResponseTokenDto> {
    const expiresAt = expiresAtGenerator()

    const session = await this.sessionsService.createSession(tx, {
      userId: user.id,
      expiresAt
    })

    const payload: IPayload = {
      sign: {
        sub: user.id,
        sessionId: session.id
      }
    }

    return {
      token: this.jwtService.sign(payload)
    }
  }

  async logout(tx: PrismaClientTransaction, userId: string): Promise<void> {
    await this.sessionsService.disableAllSessionByUser(tx, userId)
    return
  }

  async validateUser(login: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.findUserByLoginOrThrow(
      this.prisma,
      login,
      {
        deletedAt: false,
        disabledAt: false
      }
    )

    return await this.validate(user, password)
  }

  private async validate<T extends { password_hash: string }>(
    user: T,
    password: string
  ): Promise<T> {
    if (user) {
      const isPasswordValid = await compare(password, user.password_hash)

      if (isPasswordValid) {
        return { ...user, password_hash: undefined }
      }
    }

    throw new UnauthorizedException('Login or password incorrect.')
  }
}
