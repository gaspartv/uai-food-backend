import { Type } from 'class-transformer'
import { StoreWithNotRelationsEntity } from '../../stores/entities/store.entity'
import { UserWithNotRelationsEntity } from '../../users/entities/user.entity'

export class ConversationWithNotRelationsEntity {
  id: string
}

export class ConversationEntity extends ConversationWithNotRelationsEntity {
  @Type(() => UserWithNotRelationsEntity)
  Users: UserWithNotRelationsEntity[]

  @Type(() => StoreWithNotRelationsEntity)
  Store: StoreWithNotRelationsEntity
}
