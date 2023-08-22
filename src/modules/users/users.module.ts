import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EnvService } from '../../config/env/service.env'
import { PrismaModule } from '../../config/prisma/prisma.module'
import { RedisService } from '../../config/redis/redis.service'
import { AddressesModule } from '../addresses/addresses.module'
import { UserPrismaRepository } from './repositories/prisma/user.prisma.repository'
import { UserRedisRepository } from './repositories/redis/user.redis.repository'
import { UserRepository } from './repositories/user.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [PrismaModule, AddressesModule, ConfigModule],
  controllers: [UsersController],
  providers: [
    UserRedisRepository,
    RedisService,
    UsersService,
    EnvService,
    { provide: UserRepository, useClass: UserPrismaRepository }
  ],
  exports: [UsersService]
})
export class UsersModule {}
