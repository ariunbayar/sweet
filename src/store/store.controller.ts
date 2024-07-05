import { Controller } from '@nestjs/common'
import { Get, Post, Put, Body } from '@nestjs/common'
import { Query, Param, ParseIntPipe } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'

import { PaginationDto } from '../common/dto/pagination.dto'
import { PaginatedResultDto } from '../common/dto/paginated-result.dto'
import { StoreService } from './store.service'
import { CreateStoreDto } from './dto/create-store.dto'
import { Store } from './entities/store.entity'
import { UpdateStoreDto } from './dto/update-store.dto'

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const { offset, limit } = paginationDto
    const count = await this.storeService.count()
    const stores = await this.storeService.findAll(offset, limit)

    const paginatedResultDto = new PaginatedResultDto<Store>()
    paginatedResultDto.result = stores
    paginatedResultDto.pagination = {
      offset,
      limit,
      total: count,
    }

    return paginatedResultDto
  }

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const store = await this.storeService.findOne(id)
    if (!store) {
      throw new NotFoundException(`Not found`)
    }
    return store
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    const store = await this.storeService.findOne(id)
    if (!store) {
      throw new NotFoundException(`Not found`)
    }
    return this.storeService.update(store, updateStoreDto)
  }
}
