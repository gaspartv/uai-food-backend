import { Type } from 'class-transformer'
import { StoreWithNotRelationsEntity } from '../../stores/entities/store.entity'
import { UserWithNotRelationsEntity } from '../../users/entities/user.entity'

export class AddressWithNotRelationsEntity {
  id: string
  street: string
  addressNumber: string
  country: string
  city: string
  state: string
  province: string
  zip_code: string
  complement?: string
}

export class AddressEntity extends AddressWithNotRelationsEntity {
  @Type(() => StoreWithNotRelationsEntity)
  Store?: StoreWithNotRelationsEntity

  @Type(() => UserWithNotRelationsEntity)
  User?: UserWithNotRelationsEntity
}
