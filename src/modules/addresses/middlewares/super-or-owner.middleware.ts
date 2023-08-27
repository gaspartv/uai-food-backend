import {
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaClient } from '@prisma/client'
import { NextFunction } from 'express'
import { FastifyReply } from 'fastify'
import { IRequest } from '../../../common/interfaces/request.interface'
import { RedisService } from '../../../config/redis/redis.service'
import { UserEntity } from '../../users/entities/user.entity'
import { UsersService } from '../../users/users.service'

@Injectable()
export class SuperOrOwnerMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redis: RedisService
  ) {}

  async use(req: IRequest, res: FastifyReply, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split('Bearer ')[1]

      if (!token) {
        throw new UnauthorizedException('Invalid token.')
      }

      const decoded: any = this.jwtService.decode(token)

      if (!decoded.sign.sub) {
        throw new UnauthorizedException('Invalid token.')
      }
      let user: UserEntity

      const cachedUser = await this.redis.get(decoded.sign.sub)
      if (cachedUser) {
        const userCached: UserEntity = JSON.parse(cachedUser)

        if (userCached.deletedAt === null && userCached.disabledAt === null) {
          user = userCached
        }
      } else {
        user = await this.usersService.findUserById(
          this.prisma,
          decoded.sign.sub,
          { deletedAt: false, disabledAt: false }
        )
      }

      if (!user) {
        throw new UnauthorizedException('Invalid token.')
      }

      const id = req.originalUrl.split('/')[2]

      if (user.type || user.Address.id === id) {
        return next()
      }
    }
    throw new UnauthorizedException('Unauthorized.')
  }
}
