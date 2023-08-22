import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import 'dotenv/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { EnvService } from '../../config/env/service.env'
import { IPayload } from '../interfaces/payload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-all') {
  constructor(envService: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.env.JWT_SECRET
    })
  }

  async validate(payload: IPayload): Promise<IPayload> {
    const { sign } = payload

    return { sign }
  }
}
