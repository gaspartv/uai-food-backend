import { User } from '@prisma/client'
import { FastifyRequest } from 'fastify'

export interface IAuthRequest extends FastifyRequest {
  user: User
}
