import { Type } from 'class-transformer'
import { AddressWithNotRelationsEntity } from '../../addresses/entities/address.entity'
import { CategoryWithNotRelationsEntity } from '../../categories/entities/category.entity'
import { PurchaseWithNotRelationsEntity } from '../../purchases/entities/purchase.entity'
import { StarWithNotRelationsEntity } from '../../stars/entities/star.entity'
import { StorePermissionWithNotRelationsEntity } from '../../store-permissions/entities/store-permission.entity'

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

  @Type(() => StarWithNotRelationsEntity)
  Stars: StarWithNotRelationsEntity[]

  @Type(() => CategoryWithNotRelationsEntity)
  Categories: CategoryWithNotRelationsEntity[]

  @Type(() => StorePermissionWithNotRelationsEntity)
  UsersPermission: StorePermissionWithNotRelationsEntity[]
}
