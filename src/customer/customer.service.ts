import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Customer } from './customer.entity'
import { CreateCustomerDto } from './dto/create-customer.dto'

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = new Customer()
    customer.name = createCustomerDto.name
    return this.customerRepository.save(customer)
  }

  /* TODO usage
  findAll(): Promise<Customer[]> {
    return this.customerRepository.find()
    }
    */

  findOne(id: number): Promise<Customer | null> {
    return this.customerRepository.findOneBy({ id })
  }
}
