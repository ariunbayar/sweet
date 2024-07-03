import { Controller, Get } from '@nestjs/common'
import { Post, Body } from '@nestjs/common'
import { Param, ParseIntPipe } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'

import { StoreService } from './store.service'
import { CreateStoreDto } from './dto/create-store.dto'

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const customer = await this.storeService.findOne(id)
    if (!customer) {
      throw new NotFoundException(`Not found`)
    }
    return customer
  }
}
