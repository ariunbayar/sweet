import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { CustomerService } from './customer.service'
import { Customer } from './customer.entity'
import { Repository } from 'typeorm'

const oneCustomer = {
  id: 1,
  name: 'The Coffee Beanery',
}

describe('CustomerService', () => {
  let service: CustomerService
  let repository: Repository<Customer>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            save: jest.fn().mockResolvedValue(oneCustomer),
            findOneBy: jest.fn().mockResolvedValue(oneCustomer),
            find: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<CustomerService>(CustomerService)
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer))
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

  describe('update()', () => {
    it('should successfully update a customer', () => {
      const customer: Customer = { id: 1, name: 'The Coffee Beanery' }
      const updateCustomerDto = { name: 'New name' }

      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ id: 1, name: 'New name' })
      const result = service.update(customer, updateCustomerDto)

      expect(result).resolves.toEqual({ id: 1, name: 'New name' })
      expect(repository.save).toBeCalledWith({ id: 1, name: 'New name' })
    })
  })

  describe('findOne()', () => {
    it('should get a single customer', () => {
      const repoSpy = jest.spyOn(repository, 'findOneBy')
      expect(service.findOne(1)).resolves.toEqual(oneCustomer)
      expect(repoSpy).toBeCalledWith({ id: 1 })
    })

    it('returns null', () => {
      const repoSpy = jest
        .spyOn(repository, 'findOneBy')
        .mockResolvedValue(null)
      expect(service.findOne(2)).resolves.toBeNull()
      expect(repoSpy).toBeCalledWith({ id: 2 })
    })
  })

  describe('count()', () => {
    it('should return the count of customers', () => {
      jest.spyOn(repository, 'count').mockResolvedValue(16)
      expect(service.count()).resolves.toEqual(16)
      expect(repository.count).toHaveBeenCalled()
    })
  })

  describe('findAll()', () => {
    it('should return all customers', () => {
      const customers = [
        { id: 1, name: 'The Coffee Beanery' },
        { id: 2, name: 'The Coffee Beanery' },
      ]
      jest.spyOn(repository, 'find').mockResolvedValue(customers)
      expect(service.findAll(0, 10)).resolves.toEqual(customers)
      expect(repository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { id: 'ASC' },
      })
    })
  })
})
