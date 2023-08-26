import { ELanguage } from '@prisma/client'
import { AddressWithNotRelationsEntity } from '../../addresses/entities/address.entity'
import { AssessmentWithNotRelationsEntity } from '../../assessments/entities/assessment.entity'
import { ConversationWithNotRelationsEntity } from '../../conversation/entities/conversation.entity'
import { PermissionWithNotRelationsEntity } from '../../permissions/entities/permission.entity'
import { PurchaseWithNotRelationsEntity } from '../../purchases/entities/purchase.entity'

export class ResponseUserDto {
  id: string
  balance: number
  nivel: number
  experience: number
  firstName: string
  lastName: string
  description?: string
  email: string
  phone: string
  imageUri?: string
  dark_mode: boolean
  language: ELanguage
  createdAt: Date
  updatedAt: Date
  disabledAt?: Date
  Address: AddressWithNotRelationsEntity
  Purchases: PurchaseWithNotRelationsEntity[]
  Assessments: AssessmentWithNotRelationsEntity[]
  Permissions: PermissionWithNotRelationsEntity[]
  Conversations: ConversationWithNotRelationsEntity[]
}

export class ResponseUserPaginationDto {
  limit: number
  page: number
  total: number
  next: string
  previous: string
  results: ResponseUserDto[]
}
