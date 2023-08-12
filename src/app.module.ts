import { Module, ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { Redis } from 'ioredis'
import { AppController } from './app.controller'
import { AppService } from './app.service'

const redis = new Redis({
  host: 'localhost',
  port: Number(process.env.PORT_REDIS) || 8081
})

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
      storage: redis
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load,
      validate,
      validationOptions: { allowUnknown: false }
    })
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ValidationPipe }]
})
export class AppModule {}
