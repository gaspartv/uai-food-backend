import { Body, Controller, Param, Patch } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AddressesService } from './addresses.service'
import { UpdateAddressDto } from './dto/update-address.dto'
import { AddressEntity } from './entities/address.entity'

@Controller('addresses')
export class AddressesController {
  constructor(
    private readonly addressesService: AddressesService,
    private readonly prisma: PrismaClient
  ) {}

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto
  ): Promise<AddressEntity> {
    return await this.prisma.$transaction(async (tx) => {
      return this.addressesService.updateAddress(tx, id, dto)
    })
  }
}
