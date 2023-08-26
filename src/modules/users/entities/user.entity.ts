import { ELanguage, EUserType } from '@prisma/client'
import { Type } from 'class-transformer'
import { AddressWithNotRelationsEntity } from '../../addresses/entities/address.entity'
import { AssessmentWithNotRelationsEntity } from '../../assessments/entities/star.entity'
import { PermissionWithNotRelationsEntity } from '../../permissions/entities/permission.entity'
import { PurchaseWithNotRelationsEntity } from '../../purchases/entities/purchase.entity'

export class UserWithNotRelationsEntity {
  id: string
  type?: EUserType
  balance: number
  nivel: number
  experience: number
  firstName: string
  lastName: string
  description?: string
  email: string
  login: string
  phone: string
  password_hash: string
  imageUri?: string
  dark_mode: boolean
  language: ELanguage
  createdAt: Date
  updatedAt: Date
  disabledAt?: Date
  deletedAt?: Date
  addressId: string
}

export class UserEntity extends UserWithNotRelationsEntity {
  @Type(() => AddressWithNotRelationsEntity)
  Address: AddressWithNotRelationsEntity

  @Type(() => PurchaseWithNotRelationsEntity)
  Purchases: PurchaseWithNotRelationsEntity[]

  @Type(() => PermissionWithNotRelationsEntity)
  StorePermissions: PermissionWithNotRelationsEntity[]

  @Type(() => AssessmentWithNotRelationsEntity)
  Stars: AssessmentWithNotRelationsEntity[]
}
