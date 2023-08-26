import { Type } from 'class-transformer'
import { PurchaseWithNotRelationsEntity } from '../../purchases/entities/purchase.entity'
import { StoreWithNotRelationsEntity } from '../../stores/entities/store.entity'
import { UserWithNotRelationsEntity } from '../../users/entities/user.entity'

export class AssessmentWithNotRelationsEntity {
  id: string
  value: number
  comment?: string
  userId: string
  purchaseId: string
  storeId: string
}

export class AssessmentEntity extends AssessmentWithNotRelationsEntity {
  @Type(() => UserWithNotRelationsEntity)
  User: UserWithNotRelationsEntity

  @Type(() => PurchaseWithNotRelationsEntity)
  Purchase: PurchaseWithNotRelationsEntity

  @Type(() => StoreWithNotRelationsEntity)
  Store: StoreWithNotRelationsEntity
}
