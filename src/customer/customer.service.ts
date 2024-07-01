import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Customer } from './customer.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find()
  }

  findOne(id: number): Promise<Customer | null> {
    return this.customerRepository.findOneBy({ id })
  }

  async remove(id: number): Promise<void> {
    await this.customerRepository.delete(id)
  }
}
