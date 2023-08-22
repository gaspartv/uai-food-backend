import { Injectable } from '@nestjs/common';
import { CreateStorePermissionDto } from './dto/create-store-permission.dto';
import { UpdateStorePermissionDto } from './dto/update-store-permission.dto';

@Injectable()
export class StorePermissionsService {
  create(createStorePermissionDto: CreateStorePermissionDto) {
    return 'This action adds a new storePermission';
  }

  findAll() {
    return `This action returns all storePermissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storePermission`;
  }

  update(id: number, updateStorePermissionDto: UpdateStorePermissionDto) {
    return `This action updates a #${id} storePermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} storePermission`;
  }
}
