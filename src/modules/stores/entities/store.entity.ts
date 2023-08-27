import { Type } from 'class-transformer'
import { AddressWithNotRelationsEntity } from '../../addresses/entities/address.entity'
import { AssessmentWithNotRelationsEntity } from '../../assessments/entities/assessment.entity'
import { CategoryWithNotRelationsEntity } from '../../categories/entities/category.entity'
import { ConversationWithNotRelationsEntity } from '../../conversation/entities/conversation.entity'
import { PermissionWithNotRelationsEntity } from '../../permissions/entities/permission.entity'
import { PurchaseWithNotRelationsEntity } from '../../purchases/entities/purchase.entity'

export class StoreWithNotRelationsEntity {
  id: string
  corporateName: string
  tradingName: string
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
  Assessments: AssessmentWithNotRelationsEntity[]

  @Type(() => CategoryWithNotRelationsEntity)
  Categories: CategoryWithNotRelationsEntity[]

  @Type(() => PermissionWithNotRelationsEntity)
  Permissions: PermissionWithNotRelationsEntity[]

  @Type(() => ConversationWithNotRelationsEntity)
  Conversations: ConversationWithNotRelationsEntity[]
}

export class StoryClientEntity {
  id: string
  corporateName: string
  tradingName: string
  cnpj: string
  identifier: string
  email: string
  phone: string
  whatsapp: string
  createdAt: Date
  updatedAt: Date
  disabledAt?: Date
  deletedAt?: Date

  @Type(() => AddressWithNotRelationsEntity)
  Address: AddressWithNotRelationsEntity

  @Type(() => CategoryWithNotRelationsEntity)
  Categories: CategoryWithNotRelationsEntity[]
}
