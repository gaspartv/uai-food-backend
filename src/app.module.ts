import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { load } from './config/env/load.env'
import { EnvService } from './config/env/service.env'
import { validate } from './config/env/validate.env'

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
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    EnvService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_PIPE, useClass: ValidationPipe }
  ]
})
export class AppModule {}
