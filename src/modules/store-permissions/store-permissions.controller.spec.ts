import { Test, TestingModule } from '@nestjs/testing'
import { StorePermissionsController } from './store-permissions.controller'
import { StorePermissionsService } from './store-permissions.service'

describe('StorePermissionsController', () => {
  let controller: StorePermissionsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorePermissionsController],
      providers: [StorePermissionsService]
    }).compile()

    controller = module.get<StorePermissionsController>(
      StorePermissionsController
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
