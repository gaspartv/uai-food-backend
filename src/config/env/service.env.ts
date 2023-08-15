import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ENodeEnvironment, EnvironmentVariables } from './load.env'

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  get env() {
    return this.configService.get<EnvironmentVariables>('environments')
  }

  isDevelopment() {
    return this.env.NODE_ENV === ENodeEnvironment.DEVELOPMENT
  }

  isProduction() {
    return this.env.NODE_ENV === ENodeEnvironment.PRODUCTION
  }
}
