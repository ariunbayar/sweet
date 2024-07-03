import { Controller } from '@nestjs/common'
import { Get, Post, Put, Body } from '@nestjs/common'
import { Param, ParseIntPipe } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'

import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { CustomerService } from './customer.service'

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

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
