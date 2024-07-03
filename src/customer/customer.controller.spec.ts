import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'

import { CustomerController } from './customer.controller'
import { CustomerService } from './customer.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { Customer } from './customer.entity'

const createCustomerDto: CreateCustomerDto = { name: 'The Candy Emporium' }
const updateCustomerDto: UpdateCustomerDto = { name: 'Updated Name' }

const oneCustomer: Customer = {
  id: 1,
  name: 'The Candy Emporium',
}

describe('CustomerController', () => {
  let controller: CustomerController
  let customerService: CustomerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((customerDto: CreateCustomerDto) =>
                Promise.resolve({ id: 1, ...customerDto }),
              ),
            findOne: jest
              .fn()
              .mockImplementation((id: number) =>
                Promise.resolve({ ...oneCustomer, id }),
              ),
            update: jest
              .fn()
              .mockImplementation((customer, updateCustomerDto) =>
                Promise.resolve({ ...customer, ...updateCustomerDto }),
              ),
            findAll: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<CustomerController>(CustomerController)
    customerService = module.get<CustomerService>(CustomerService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create()', () => {
    it('should create a new customer', async () => {
      const expectedCustomer = { id: 1, ...createCustomerDto }

      const result = await controller.create(createCustomerDto)

      expect(result).toEqual(expectedCustomer)
      expect(customerService.create).toHaveBeenCalledWith(createCustomerDto)
    })
  })

  describe('update()', () => {
    it('should update a customer', async () => {
      const result = await controller.update(1, updateCustomerDto)

      expect(result).toEqual({ id: 1, name: 'Updated Name' })
      expect(customerService.findOne).toHaveBeenCalledWith(1)
      expect(customerService.update).toHaveBeenCalledWith(
        oneCustomer,
        updateCustomerDto,
      )
    })

    it('should throw NotFoundException if customer not found', async () => {
      jest.spyOn(customerService, 'findOne').mockResolvedValue(null)

      try {
        await controller.update(2, updateCustomerDto)
        fail('Expected NotFoundException to be thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
        expect(error.message).toEqual('Not found')
        expect(customerService.findOne).toHaveBeenCalledWith(2)
        expect(customerService.update).not.toHaveBeenCalled()
      }
    })
  })

  describe('findOne()', () => {
    it('should find a customer by id', async () => {
      const expectedCustomer = { id: 1, name: 'The Candy Emporium' }
      const result = await controller.findOne(1)

      expect(result).toEqual(expectedCustomer)
      expect(customerService.findOne).toHaveBeenCalledWith(1)
    })

    it('throws NotFoundException when customer is not found', async () => {
      jest.spyOn(customerService, 'findOne').mockResolvedValue(null)

      try {
        await controller.findOne(2)
        fail('Expected NotFoundException to be thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException)
        expect(error.message).toEqual('Not found')
        expect(customerService.findOne).toHaveBeenCalledWith(2)
      }
    })
  })

  describe('findAll()', () => {
    it('should return a list of customers', async () => {
      const expectedCustomers = [
        { id: 1, name: 'The Candy Emporium' },
        { id: 2, name: 'The Sweet Shop' },
      ]

      jest
        .spyOn(customerService, 'findAll')
        .mockResolvedValue(expectedCustomers)
      jest.spyOn(customerService, 'count').mockResolvedValue(2)

      const result = await controller.findAll({ offset: 0, limit: 10 })

      expect(result).toEqual({
        result: expectedCustomers,
        pagination: { offset: 0, limit: 10, total: 2 },
      })
      expect(customerService.findAll).toHaveBeenCalledWith(0, 10)
      expect(customerService.count).toHaveBeenCalled()
    })
  })
})
