import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Store } from './entities/store.entity'
import { CreateStoreDto } from './dto/create-store.dto'
import { UpdateStoreDto } from './dto/update-store.dto'

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = new Store()
    store.address = createStoreDto.address
    store.manager_name = createStoreDto.manager_name
    return this.storeRepository.save(store)
  }

  findOne(id: number): Promise<Store | null> {
    return this.storeRepository.findOneBy({ id })
  }

  findAll(offset: number, limit: number): Promise<Store[]> {
    return this.storeRepository.find({
      skip: offset,
      take: limit,
      order: { id: 'ASC' },
    })
  }

  count(): Promise<number> {
    return this.storeRepository.count()
  }

  update(store: Store, updateStoreDto: UpdateStoreDto): Promise<Store> {
    store = { ...store, ...updateStoreDto }
    return this.storeRepository.save(store)
  }
}
