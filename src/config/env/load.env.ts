import { registerAs } from '@nestjs/config'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

export enum ENodeEnvironment {
  DEVELOPMENT = 'dev',
  PRODUCTION = 'prod',
  TEST = 'test'
}

export class EnvironmentVariables {
  @IsOptional()
  @IsEnum(ENodeEnvironment)
  NODE_ENV: ENodeEnvironment

  @IsString()
  JWT_SECRET: string

  @IsString()
  DATABASE_URL: string

  @IsNumber()
  HASH_SALT: number

  @IsNumber()
  PORT: number

  @IsNumber()
  PORT_REDIS: number

  @IsString()
  FRONTEND_URL: string

  @IsString()
  JWT_EXPIRES_IN: string
}

export const load = [
  registerAs('environments', () => ({
    NODE_ENV: process.env.NODE_ENV || ENodeEnvironment.DEVELOPMENT,

    JWT_SECRET: process.env.JWT_SECRET,

    DATABASE_URL: process.env.DATABASE_URL,

    HASH_SALT: process.env.HASH_SALT,

    PORT: process.env.PORT,

    PORT_REDIS: process.env.PORT_REDIS,

    FRONTEND_URL: process.env.FRONTEND_URL,

    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
  }))
]
