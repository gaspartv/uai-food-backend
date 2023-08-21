import {
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaClient } from '@prisma/client'
import { NextFunction } from 'express'
import { FastifyReply } from 'fastify'
import { SessionsService } from '../../modules/sessions/sessions.service'
import { expiresAtGenerator } from '../../utils/expires-generator.utils'
import { IPayload } from '../interfaces/payload.interface'
import { IRequest } from '../interfaces/request.interface'

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService
  ) {}

  async use(req: IRequest, _res: FastifyReply, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split('Bearer ')[1]

      if (!token) {
        throw new UnauthorizedException('Invalid token.')
      }

      const decoded: any = this.jwtService.decode(token)

      if (!decoded || !decoded.sign || !decoded.sign.sessionId) {
        throw new UnauthorizedException('Invalid token.')
      }

      const session = await this.sessionsService.findSessionById(
        this.prisma,
        decoded.sign.sessionId
      )

      if (!session) {
        throw new UnauthorizedException('Expired token.')
      }

      if (session.loggedOutAt !== null) {
        throw new UnauthorizedException('Expired token.')
      }

      if (session.tokens.includes(token)) {
        throw new UnauthorizedException('Expired token.')
      }

      if (Number(new Date().getTime()) >= Number(session.expiresAt.getTime())) {
        const expiresAt = expiresAtGenerator()

        const payload: IPayload = {
          sign: {
            sub: session.userId,
            sessionId: session.id
          }
        }

        const newToken = this.jwtService.sign(payload)

        req.headers.authorization = `Bearer ${newToken}`

        await this.sessionsService.updateSession(this.prisma, session.id, {
          expiresAt,
          tokens: [...session.tokens, token]
        })
      }
    }

    next()
  }
}
