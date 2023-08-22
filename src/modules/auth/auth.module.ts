import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { EnvService } from '../../config/env/service.env'
import { PrismaModule } from '../../config/prisma/prisma.module'
import { SessionsModule } from '../sessions/sessions.module'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
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

    UsersModule,
    SessionsModule
  ],
  controllers: [AuthController],
  providers: [AuthService, EnvService, LocalStrategy],
  exports: [PassportModule, AuthService]
})
export class AuthModule {}
