import { ELanguage } from '@prisma/client'
import { AddressWithNotRelationsEntity } from '../../addresses/entities/address.entity'
import { PermissionWithNotRelationsEntity } from '../../permissions/entities/permission.entity'
import { PurchaseWithNotRelationsEntity } from '../../purchases/entities/purchase.entity'
import { StarWithNotRelationsEntity } from '../../stars/entities/star.entity'

export class ResponseUserDto {
  id: string
  balance: number
  nivel: number
  experience: number
  firstName: string
  lastName: string
  description?: string
  email: string
  phone: string
  imageUri?: string
  dark_mode: boolean
  language: ELanguage
  createdAt: Date
  updatedAt: Date
  disabledAt?: Date
  Address: AddressWithNotRelationsEntity
  Purchases: PurchaseWithNotRelationsEntity[]
  Stars: StarWithNotRelationsEntity[]
  StorePermissions: PermissionWithNotRelationsEntity[]
}

export class ResponseUserPaginationDto {
  limit: number
  page: number
  total: number
  next: string
  previous: string
  results: ResponseUserDto[]
}
