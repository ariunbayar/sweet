import { Controller } from '@nestjs/common'
import { Post, Body } from '@nestjs/common'

import { StoreService } from './store.service'
import { CreateStoreDto } from './dto/create-store.dto'

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto)
  }
}
