import { Module } from '@nestjs/common';
import { StorePermissionsService } from './store-permissions.service';
import { StorePermissionsController } from './store-permissions.controller';

@Module({
  controllers: [StorePermissionsController],
  providers: [StorePermissionsService],
})
export class StorePermissionsModule {}
