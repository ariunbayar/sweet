import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { CustomerService } from './customer.service'
import { Customer } from './customer.entity'

const oneCustomer = {
  id: 1,
  name: 'The Coffee Beanery',
}

describe('CustomerService', () => {
  let service: CustomerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            save: jest.fn().mockResolvedValue(oneCustomer),
          },
        },
      ],
    }).compile()

    service = module.get<CustomerService>(CustomerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create()', () => {
    it('should successfully insert a customer', () => {
      expect(
        service.create({
          name: 'The Coffee Beanery',
        }),
      ).resolves.toEqual({
        id: 1,
        name: 'The Coffee Beanery',
      })
    })
  })
})
