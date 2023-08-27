import { IsOptional, IsString } from 'class-validator'

export class CreateAddressDto {
  @IsString()
  street: string

  @IsString()
  addressNumber: string

  @IsString()
  country: string

  @IsString()
  city: string

  @IsString()
  state: string

  @IsString()
  province: string

  @IsString()
  zipCode: string

  @IsOptional()
  @IsString()
  complement?: string
}
