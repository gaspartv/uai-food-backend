import { ELanguage } from '@prisma/client'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString
} from 'class-validator'
import { CreateAddressDto } from '../../addresses/dto/create-address.dto'

export class CreateUserDto {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsOptional()
  @IsString()
  description?: string

  @IsEmail()
  email: string

  @IsString()
  login: string

  @IsPhoneNumber('BR')
  phone: string

  @IsString()
  password: string

  @IsBoolean()
  dark_mode: boolean

  @IsEnum(ELanguage)
  language: ELanguage

  @IsObject()
  address: CreateAddressDto
}
