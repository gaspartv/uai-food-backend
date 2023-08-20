import { FastifyRequest } from 'fastify'
import { IApplication } from './auth-payload.interface'

export interface IJwtRequest extends FastifyRequest {
  user: IApplication
}
