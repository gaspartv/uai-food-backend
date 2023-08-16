import { Module } from '@nestjs/common'
import { PrismaModule } from '../../config/env/prisma/prisma.module'
import { AddressesController } from './addresses.controller'
import { AddressesService } from './addresses.service'
import { AddressRepository } from './repositories/address.repository'
import { AddressPrismaRepository } from './repositories/prisma/address.prisma.repository'

@Module({
  imports: [PrismaModule],
  controllers: [AddressesController],
  providers: [
    AddressesService,
    { provide: AddressRepository, useClass: AddressPrismaRepository }
  ],
  exports: [AddressesService]
})
export class AddressesModule {}
