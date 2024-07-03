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
    private customerRepository: Repository<Store>,
  ) {}

  create(createStoreDto: CreateStoreDto): Promise<Store> {
    const customer = new Store()
    customer.address = createStoreDto.address
    customer.manager_name = createStoreDto.manager_name
    return this.customerRepository.save(customer)
  }

  findOne(id: number): Promise<Store | null> {
    return this.customerRepository.findOneBy({ id })
  }

  findAll(offset: number, limit: number): Promise<Store[]> {
    return this.customerRepository.find({ skip: offset, take: limit })
  }

  count(): Promise<number> {
    return this.customerRepository.count()
  }

  update(store: Store, updateStoreDto: UpdateStoreDto): Promise<Store> {
    store = { ...store, ...updateStoreDto }
    return this.customerRepository.save(store)
  }
}
