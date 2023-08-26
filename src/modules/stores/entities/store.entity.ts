import { Type } from 'class-transformer'
import { AddressWithNotRelationsEntity } from '../../addresses/entities/address.entity'
import { AssessmentWithNotRelationsEntity } from '../../assessments/entities/star.entity'
import { CategoryWithNotRelationsEntity } from '../../categories/entities/category.entity'
import { PermissionWithNotRelationsEntity } from '../../permissions/entities/permission.entity'
import { PurchaseWithNotRelationsEntity } from '../../purchases/entities/purchase.entity'

export class StoreWithNotRelationsEntity {
  id: string
  corporate_name: string
  trading_name: string
  cnpj: string
  identifier: string
  email: string
  phone: string
  whatsapp: string
  createdAt: Date
  updatedAt: Date
  disabledAt?: Date
  deletedAt?: Date
  addressId: string
}

export class StoreEntity extends StoreWithNotRelationsEntity {
  @Type(() => AddressWithNotRelationsEntity)
  Address: AddressWithNotRelationsEntity

  @Type(() => PurchaseWithNotRelationsEntity)
  Purchases: PurchaseWithNotRelationsEntity[]

  @Type(() => AssessmentWithNotRelationsEntity)
  Stars: AssessmentWithNotRelationsEntity[]

  @Type(() => CategoryWithNotRelationsEntity)
  Categories: CategoryWithNotRelationsEntity[]

  @Type(() => PermissionWithNotRelationsEntity)
  UsersPermission: PermissionWithNotRelationsEntity[]
}
