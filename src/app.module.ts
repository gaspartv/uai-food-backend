import { BullModule } from '@nestjs/bull'
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { CheckPasswordGuard } from './common/guards/check-password.guard'
import { JwtGuard } from './common/guards/jwt.guard'
import { RefreshTokenMiddleware } from './common/middlewares/refresh-token.middleware'
import { JwtStrategy } from './common/strategies/jwt.strategy'
import { load } from './config/env/load.env'
import { EnvService } from './config/env/service.env'
import { validate } from './config/env/validate.env'
import { PrismaModule } from './config/prisma/prisma.module'
import { RedisModule } from './config/redis/redis.modules'
import { AddressesModule } from './modules/addresses/addresses.module'
import { AssessmentsModule } from './modules/assessments/assessments.module'
import { AuthModule } from './modules/auth/auth.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { ConversationModule } from './modules/conversation/conversation.module'
import { PermissionsModule } from './modules/permissions/permissions.module'
import { PurchasesModule } from './modules/purchases/purchases.module'
import { SessionsModule } from './modules/sessions/sessions.module'
import { StoresModule } from './modules/stores/stores.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379
      }
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load,
      validate,
      validationOptions: { allowUnknown: false }
    }),
    PrismaModule,

    UsersModule,
    AssessmentsModule,
    PurchasesModule,
    AddressesModule,
    StoresModule,
    CategoriesModule,
    PermissionsModule,
    AuthModule,
    SessionsModule,
    ConversationModule,
    RedisModule
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtGuard },
    { provide: APP_GUARD, useClass: CheckPasswordGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
    EnvService,
    JwtStrategy
  ],
  exports: [JwtStrategy]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes('*')
  }
}
