import { Controller } from '@nestjs/common'
import { Get, Post, Put, Body } from '@nestjs/common'
import { Query, Param, ParseIntPipe } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'

import { PaginationDto } from '../common/dto/pagination.dto'
import { PaginatedResultDto } from '../common/dto/paginated-result.dto'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerService } from './customer.service'
import { Customer } from './customer.entity'

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const { offset, limit } = paginationDto
    const count = await this.customerService.count()
    const customers = await this.customerService.findAll(offset, limit)

    const paginatedResultDto = new PaginatedResultDto<Customer>()
    paginatedResultDto.result = customers
    paginatedResultDto.pagination = {
      offset,
      limit,
      total: count,
    }

    return paginatedResultDto
  }

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const customer = await this.customerService.findOne(id)
    if (!customer) {
      throw new NotFoundException(`Not found`)
    }
    return customer
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer = await this.customerService.findOne(id)
    if (!customer) {
      throw new NotFoundException(`Not found`)
    }
    return this.customerService.update(customer, updateCustomerDto)
  }
}
