import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaModule } from '../../config/prisma/prisma.module'
import { RedisModule } from '../../config/redis/redis.modules'
import { UsersModule } from '../users/users.module'
import { AddressesController } from './addresses.controller'
import { AddressesService } from './addresses.service'
import { SuperOrOwnerMiddleware } from './middlewares/super-or-owner.middleware'
import { AddressRepository } from './repositories/address.repository'
import { AddressPrismaRepository } from './repositories/prisma/address.prisma.repository'

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    RedisModule,
    forwardRef(() => UsersModule)
  ],
  controllers: [AddressesController],
  providers: [
    JwtService,
    AddressesService,
    { provide: AddressRepository, useClass: AddressPrismaRepository }
  ],
  exports: [AddressesService]
})
export class AddressesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SuperOrOwnerMiddleware).forRoutes(AddressesController)
  }
}
