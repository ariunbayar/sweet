import { Test, TestingModule } from '@nestjs/testing'
import { CustomerController } from './customer.controller'
import { CustomerService } from './customer.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { NotFoundException } from '@nestjs/common'

const createCustomerDto: CreateCustomerDto = { name: 'The Candy Emporium' }

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
            findOne: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                name: 'The Candy Emporium',
                id,
              }),
            ),
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
})
