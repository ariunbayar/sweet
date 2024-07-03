import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { Inventory } from './entities/inventory.entity'
import { CreateInventoryDto } from './dto/create-inventory.dto'
import { UpdateInventoryDto } from './dto/update-inventory.dto'

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private repository: Repository<Inventory>,
  ) {}

  create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    return this.repository.save({
      ...createInventoryDto,
    })
  }

  findOne(id: number): Promise<Inventory | null> {
    return this.repository.findOneBy({ id })
  }

  findAll(offset: number, limit: number): Promise<Inventory[]> {
    return this.repository.find({
      skip: offset,
      take: limit,
      order: { id: 'ASC' },
    })
  }

  count(): Promise<number> {
    return this.repository.count()
  }

  update(
    inventory: Inventory,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    inventory = { ...inventory, ...updateInventoryDto }
    return this.repository.save(inventory)
  }
}
