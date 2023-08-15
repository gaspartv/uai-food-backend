import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { load } from './config/env/load.env'
import { EnvService } from './config/env/service.env'
import { validate } from './config/env/validate.env'
import { AddressesModule } from './modules/addresses/addresses.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { PurchasesModule } from './modules/purchases/purchases.module'
import { StarsModule } from './modules/stars/stars.module'
import { StorePermissionsModule } from './modules/store-permissions/store-permissions.module'
import { StoresModule } from './modules/stores/stores.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
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
    StorePermissionsModule
  ],
  controllers: [],
  providers: [
    EnvService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_PIPE, useClass: ValidationPipe }
  ]
})
export class AppModule {}
