import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EnvService } from '../../config/env/service.env'
import { PrismaModule } from '../../config/prisma/prisma.module'
import { AddressesModule } from '../addresses/addresses.module'
import { UserPrismaRepository } from './repositories/prisma/user.prisma.repository'
import { UserRepository } from './repositories/user.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [PrismaModule, AddressesModule, ConfigModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    EnvService,
    { provide: UserRepository, useClass: UserPrismaRepository }
  ],
  exports: [UsersService]
})
export class UsersModule {}
