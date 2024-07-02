import { Test, TestingModule } from '@nestjs/testing'
import { CustomerController } from './customer.controller'
import { CustomerService } from './customer.service'
import { CreateCustomerDto } from './dto/create-customer.dto'

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
            create: jest.fn(),
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

  it('should create a new customer', async () => {
    const createCustomerDto: CreateCustomerDto = { name: 'The Candy Emporium' }
    const expectedCustomer = { id: 1, name: 'The Candy Emporium' } // Mock customer response

    jest.spyOn(customerService, 'create').mockResolvedValue(expectedCustomer)

    const result = await controller.create(createCustomerDto)

    expect(result).toEqual(expectedCustomer)
    expect(customerService.create).toHaveBeenCalledWith(createCustomerDto)
  })
})
