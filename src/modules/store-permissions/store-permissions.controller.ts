import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { StorePermissionsService } from './store-permissions.service'
import { CreateStorePermissionDto } from './dto/create-store-permission.dto'
import { UpdateStorePermissionDto } from './dto/update-store-permission.dto'

@Controller('store-permissions')
export class StorePermissionsController {
  constructor(
    private readonly storePermissionsService: StorePermissionsService
  ) {}

  @Post()
  create(@Body() createStorePermissionDto: CreateStorePermissionDto) {
    return this.storePermissionsService.create(createStorePermissionDto)
  }

  @Get()
  findAll() {
    return this.storePermissionsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storePermissionsService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStorePermissionDto: UpdateStorePermissionDto
  ) {
    return this.storePermissionsService.update(+id, updateStorePermissionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storePermissionsService.remove(+id)
  }
}
