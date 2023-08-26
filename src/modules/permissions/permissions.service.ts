import { Injectable } from '@nestjs/common'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'

@Injectable()
export class PermissionsService {
  create(createStorePermissionDto: CreatePermissionDto) {
    return 'This action adds a new storePermission'
  }

  findAll() {
    return `This action returns all storePermissions`
  }

  findOne(id: number) {
    return `This action returns a #${id} storePermission`
  }

  update(id: number, updateStorePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} storePermission`
  }

  remove(id: number) {
    return `This action removes a #${id} storePermission`
  }
}
