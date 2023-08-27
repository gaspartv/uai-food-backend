import { Injectable } from '@nestjs/common'
import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'
import { StoreRepository } from './repositories/stores.repository'

@Injectable()
export class StoresService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async create(createStoreDto: CreateStoreDto) {
    return 'This action adds a new store'
  }

  findAll() {
    return `This action returns all stores`
  }

  findOne(id: number) {
    return `This action returns a #${id} store`
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`
  }

  remove(id: number) {
    return `This action removes a #${id} store`
  }
}
