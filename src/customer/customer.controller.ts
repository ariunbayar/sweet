import { Controller } from '@nestjs/common'
import { Get, Post, Body } from '@nestjs/common'
import { Param, ParseIntPipe } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'

import { CreateCustomerDto } from './dto/create-customer.dto'
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
}
