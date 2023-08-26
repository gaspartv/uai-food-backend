import { ERating, EStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import { AssessmentWithNotRelationsEntity } from '../../assessments/entities/star.entity'
import { StoreWithNotRelationsEntity } from '../../stores/entities/store.entity'
import { UserWithNotRelationsEntity } from '../../users/entities/user.entity'

export class PurchaseWithNotRelationsEntity {
  id: string
  status: EStatus
  rating?: ERating
  totalPrice: number
  userId: string
  storeId: string
}

export class PurchaseEntity extends PurchaseWithNotRelationsEntity {
  @Type(() => StoreWithNotRelationsEntity)
  Store: StoreWithNotRelationsEntity

  @Type(() => UserWithNotRelationsEntity)
  User: UserWithNotRelationsEntity

  @Type(() => AssessmentWithNotRelationsEntity)
  Star?: AssessmentWithNotRelationsEntity
}
