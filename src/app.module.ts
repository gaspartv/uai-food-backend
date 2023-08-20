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
import { load } from './config/env/load.env'
import { PrismaModule } from './config/env/prisma/prisma.module'
import { EnvService } from './config/env/service.env'
import { validate } from './config/env/validate.env'
import { AddressesModule } from './modules/addresses/addresses.module'
import { AuthModule } from './modules/auth/auth.module'
import { JwtAuthGuard } from './modules/auth/guards/auth-jwt.guard'
import { CheckPasswordGuard } from './modules/auth/guards/check-password.guard'
import { RefreshTokenMiddleware } from './modules/auth/middlewares/refresh-token.middleware'
import { CategoriesModule } from './modules/categories/categories.module'
import { PurchasesModule } from './modules/purchases/purchases.module'
import { SessionsModule } from './modules/sessions/sessions.module'
import { StarsModule } from './modules/stars/stars.module'
import { StorePermissionsModule } from './modules/store-permissions/store-permissions.module'
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
    StarsModule,
    PurchasesModule,
    AddressesModule,
    StoresModule,
    CategoriesModule,
    StorePermissionsModule,
    AuthModule,
    SessionsModule
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: CheckPasswordGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
    EnvService
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes('*')
  }
}
