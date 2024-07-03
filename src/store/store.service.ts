import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Store } from './entities/store.entity'
import { CreateStoreDto } from './dto/create-store.dto'

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
}
