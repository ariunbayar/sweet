import { Test, TestingModule } from '@nestjs/testing'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { OrderService } from './order.service'
import { Order } from './entities/order.entity'
import { OrderStatus } from '../common/enums/order-status.enum'

describe('OrderService', () => {
  let service: OrderService
  let repository: Repository<Order>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<OrderService>(OrderService)
    repository = module.get<Repository<Order>>(getRepositoryToken(Order))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create()', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        customer_id: 1,
        inventory_id: 1,
        store_id: 1,
        quantity: 1,
        status: OrderStatus.PENDING,
      }
      const order = {
        id: 1,
        ...createOrderDto,
        created_at: new Date(),
        updated_at: new Date(),
      }

      jest.spyOn(repository, 'save').mockResolvedValue(order)

      expect(await service.create(createOrderDto)).toEqual(order)
      expect(repository.save).toHaveBeenCalledWith(createOrderDto)
    })
  })

  describe('findOne()', () => {
    it('should find an order by id', async () => {
      const order = {
        id: 1,
        customer_id: 1,
        inventory_id: 1,
        store_id: 1,
        quantity: 1,
        status: OrderStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
      }

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(order)

      expect(await service.findOne(1)).toEqual(order)
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 })
    })

    it('should return null if order is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null)

      expect(await service.findOne(1)).toBeNull()
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 })
    })
  })

  describe('findAll()', () => {
    it('should find all orders', async () => {
      const orders = [
        {
          id: 1,
          customer_id: 1,
          inventory_id: 1,
          store_id: 1,
          quantity: 1,
          status: OrderStatus.PENDING,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]

      jest.spyOn(repository, 'find').mockResolvedValue(orders)

      expect(await service.findAll(0, 10)).toEqual(orders)
      expect(repository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { id: 'ASC' },
      })
    })
  })

  describe('count()', () => {
    it('should return the number of orders', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(1)

      expect(await service.count()).toBe(1)
      expect(repository.count).toHaveBeenCalled()
    })
  })

  describe('update()', () => {
    it('should update an order', async () => {
      const order = {
        id: 1,
        customer_id: 1,
        inventory_id: 1,
        store_id: 1,
        quantity: 1,
        status: OrderStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
      }
      const updateOrderDto = {
        status: OrderStatus.PROCESSING,
      }
      const expected = {
        ...order,
        ...updateOrderDto,
        updated_at: new Date(),
      }

      jest.spyOn(repository, 'save').mockResolvedValue(expected)

      expect(await service.update(order, updateOrderDto)).toEqual(expected)
      expect(repository.save).toHaveBeenCalledWith({
        ...order,
        ...updateOrderDto,
      })
    })
  })
})
