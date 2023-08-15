import { Type } from 'class-transformer'
import { StoreWithNotRelationsEntity } from '../../stores/entities/store.entity'

export class CategoryWithNotRelationsEntity {
  id: string
  name: string
  description?: string
}

export class CategoryEntity extends CategoryWithNotRelationsEntity {
  @Type(() => StoreWithNotRelationsEntity)
  Stores: StoreWithNotRelationsEntity[]
}
