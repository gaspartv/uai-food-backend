import { BullModule } from '@nestjs/bull'
import { Module, ValidationPipe } from '@nestjs/common'
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
import { CategoriesModule } from './modules/categories/categories.module'
import { PurchasesModule } from './modules/purchases/purchases.module'
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
    UsersModule,
    StarsModule,
    PurchasesModule,
    AddressesModule,
    StoresModule,
    CategoriesModule,
    StorePermissionsModule,
    PrismaModule,
    AuthModule
  ],
  controllers: [],
  providers: [
    EnvService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_GUARD, useClass: JwtAuthGuard }
  ]
})
export class AppModule {}
