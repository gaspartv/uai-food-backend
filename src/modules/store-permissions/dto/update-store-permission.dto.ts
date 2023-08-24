import { PartialType } from '@nestjs/swagger'
import { CreateStorePermissionDto } from './create-store-permission.dto'

export class UpdateStorePermissionDto extends PartialType(
  CreateStorePermissionDto
) {}
