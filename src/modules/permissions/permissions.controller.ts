import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { PermissionsService } from './permissions.service'

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly storePermissionsService: PermissionsService) {}

  @Post()
  create(@Body() createStorePermissionDto: CreatePermissionDto) {
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
    @Body() updateStorePermissionDto: UpdatePermissionDto
  ) {
    return this.storePermissionsService.update(+id, updateStorePermissionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storePermissionsService.remove(+id)
  }
}
