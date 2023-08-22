import { Test, TestingModule } from '@nestjs/testing';
import { StorePermissionsService } from './store-permissions.service';

describe('StorePermissionsService', () => {
  let service: StorePermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorePermissionsService],
    }).compile();

    service = module.get<StorePermissionsService>(StorePermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
