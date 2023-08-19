import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaClient } from '@prisma/client'
import { compare } from 'bcryptjs'
import {
  UserEntity,
  UserWithNotRelationsEntity
} from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { ResponseAuthDto } from './dto/auth-response.dto'
import { IPayload } from './interfaces/auth-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async login(user: UserWithNotRelationsEntity): Promise<ResponseAuthDto> {
    const payload: IPayload = { sign: { sub: user.id } }

    return { token: this.jwtService.sign(payload) }
  }

  async validateUser(login: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.findUserByLoginOrThrow(
      this.prisma,
      login,
      { deletedAt: null, disabledAt: null }
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
