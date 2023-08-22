import { PartialType } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { IsString } from 'class-validator'
import { CreateAddressDto } from '../../addresses/dto/create-address.dto'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  password: string

  @Exclude()
  address: CreateAddressDto
}
