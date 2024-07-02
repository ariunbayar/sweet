import { Body, Controller, Post } from '@nestjs/common'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { CustomerService } from './customer.service'

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto)
  }
}
