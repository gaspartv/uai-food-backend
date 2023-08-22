import { Type } from 'class-transformer'
import { UserWithNotRelationsEntity } from '../../users/entities/user.entity'

export class SessionWithNotRelationsEntity {
  id: string
  loggedIn: Date
  expiresAt: Date
  loggedOutAt: Date | null
  userId: string
  tokens: string[]
}

export class SessionEntity extends SessionWithNotRelationsEntity {
  @Type(() => UserWithNotRelationsEntity)
  User: UserWithNotRelationsEntity
}
