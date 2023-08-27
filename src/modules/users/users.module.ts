import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EnvService } from '../../config/env/service.env'
import { PrismaModule } from '../../config/prisma/prisma.module'
import { RedisModule } from '../../config/redis/redis.modules'
import { AddressesModule } from '../addresses/addresses.module'
import { UserPrismaRepository } from './repositories/prisma/user.prisma.repository'
import { UserRedisRepository } from './repositories/redis/user.redis.repository'
import { UserRepository } from './repositories/user.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    RedisModule,
    forwardRef(() => AddressesModule)
  ],
  controllers: [UsersController],
  providers: [
    UserRedisRepository,
    UsersService,
    EnvService,
    { provide: UserRepository, useClass: UserPrismaRepository }
  ],
  exports: [UsersService]
})
export class UsersModule {}
