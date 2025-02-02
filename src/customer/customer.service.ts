import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Customer } from './customer.entity'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'

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

  update(
    customer: Customer,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    customer.name = updateCustomerDto.name
    return this.customerRepository.save(customer)
  }

  findOne(id: number): Promise<Customer | null> {
    return this.customerRepository.findOneBy({ id })
  }

  findAll(offset: number, limit: number): Promise<Customer[]> {
    return this.customerRepository.find({
      skip: offset,
      take: limit,
      order: { id: 'ASC' },
    })
  }

  count(): Promise<number> {
    return this.customerRepository.count()
  }
}
