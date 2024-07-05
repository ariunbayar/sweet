import { Controller } from '@nestjs/common'
import { Get, Post, Put, Body } from '@nestjs/common'
import { Query, Param, ParseIntPipe } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'

import { PaginationDto } from '../common/dto/pagination.dto'
import { PaginatedResultDto } from '../common/dto/paginated-result.dto'
import { InventoryService } from './inventory.service'
import { Inventory } from './entities/inventory.entity'
import { CreateInventoryDto } from './dto/create-inventory.dto'
import { UpdateInventoryDto } from './dto/update-inventory.dto'

@Controller('inventories')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const { offset, limit } = paginationDto
    const count = await this.inventoryService.count()
    const inventory = await this.inventoryService.findAll(offset, limit)

    const paginatedResultDto = new PaginatedResultDto<Inventory>()
    paginatedResultDto.result = inventory
    paginatedResultDto.pagination = {
      offset,
      limit,
      total: count,
    }

    return paginatedResultDto
  }

  @Post()
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const inventory = await this.inventoryService.findOne(id)
    if (!inventory) {
      throw new NotFoundException()
    }
    return inventory
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    const inventory = await this.inventoryService.findOne(id)
    if (!inventory) {
      throw new NotFoundException()
    }
    return this.inventoryService.update(inventory, updateInventoryDto)
  }
}
