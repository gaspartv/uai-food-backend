import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaModule } from '../../config/env/prisma/prisma.module'
import { EnvService } from '../../config/env/service.env'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/auth-jwt.strategy'
import { LocalStrategy } from './strategies/auth-local.strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-all' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }
    }),
    PrismaModule,

    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, EnvService, JwtStrategy, LocalStrategy],
  exports: [PassportModule, AuthService, JwtStrategy]
})
export class AuthModule {}
