import { Module } from '@nestjs/common'
import { PrismaModule } from '../../config/env/prisma/prisma.module'
import { EnvService } from '../../config/env/service.env'
import { AddressesModule } from '../addresses/addresses.module'
import { UserPrismaRepository } from './repositories/prisma/user.prisma.repository'
import { UserRepository } from './repositories/user.repository'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [PrismaModule, AddressesModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    EnvService,
    { provide: UserRepository, useClass: UserPrismaRepository }
  ],
  exports: [UsersService]
})
export class UsersModule {}
