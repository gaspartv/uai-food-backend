import { EUserPermission } from '@prisma/client'
import { Type } from 'class-transformer'
import { StoreWithNotRelationsEntity } from '../../stores/entities/store.entity'
import { UserWithNotRelationsEntity } from '../../users/entities/user.entity'

export class PermissionWithNotRelationsEntity {
  id: string
  type?: EUserPermission
  userId?: string
  storeId?: string
}

export class PermissionEntity extends PermissionWithNotRelationsEntity {
  @Type(() => StoreWithNotRelationsEntity)
  Store?: StoreWithNotRelationsEntity

  @Type(() => UserWithNotRelationsEntity)
  User?: UserWithNotRelationsEntity
}
