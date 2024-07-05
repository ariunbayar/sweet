import { Test, TestingModule } from '@nestjs/testing'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { NotFoundException } from '@nestjs/common'
import { OrderStatus } from '../common/enums/order-status.enum'

describe('OrderController', () => {
  let controller: OrderController
  let service: OrderService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<OrderController>(OrderController)
    service = module.get<OrderService>(OrderService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create()', () => {
    it('should create a new order', async () => {
      const createOrderDto = {
        customer_id: 1,
        inventory_id: 2,
        store_id: 3,
        quantity: 5,
        status: OrderStatus.PENDING,
      }
      const expected = {
        id: 1,
        ...createOrderDto,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      }

      jest.spyOn(service, 'create').mockResolvedValue(expected)

      expect(await controller.create(createOrderDto)).toEqual(expected)
      expect(service.create).toHaveBeenCalledWith(createOrderDto)
    })
  })

  describe('findOne()', () => {
    it('should find an order by id', async () => {
      const order = {
        id: 1,
        customer_id: 1,
        inventory_id: 2,
        store_id: 3,
        quantity: 5,
        status: OrderStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(order)

      expect(await controller.findOne(1)).toEqual(order)
      expect(service.findOne).toHaveBeenCalledWith(1)
    })

    it('should throw an error if order not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null)

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException)
      expect(service.findOne).toHaveBeenCalledWith(1)
    })
  })

  describe('findAll()', () => {
    it('should find all orders', async () => {
      const orders = [
        {
          id: 1,
          customer_id: 1,
          inventory_id: 2,
          store_id: 3,
          quantity: 5,
          status: OrderStatus.PENDING,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          customer_id: 2,
          inventory_id: 3,
          store_id: 4,
          quantity: 10,
          status: OrderStatus.PENDING,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]

      jest.spyOn(service, 'findAll').mockResolvedValue(orders)
      jest.spyOn(service, 'count').mockResolvedValue(2)

      expect(await controller.findAll({ offset: 0, limit: 10 })).toEqual({
        result: orders,
        pagination: {
          offset: 0,
          limit: 10,
          total: 2,
        },
      })

      expect(service.findAll).toHaveBeenCalledWith(0, 10)
      expect(service.count).toHaveBeenCalled()
    })
  })

  describe('update()', () => {
    it('should update an order', async () => {
      const order = {
        id: 1,
        customer_id: 1,
        inventory_id: 2,
        store_id: 3,
        quantity: 5,
        status: OrderStatus.PENDING,
        created_at: new Date(),
        updated_at: new Date(),
      }
      const updateOrderDto = {
        status: OrderStatus.DELIVERED,
      }
      const expected = {
        ...order,
        ...updateOrderDto,
        updated_at: expect.any(Date),
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(order)
      jest.spyOn(service, 'update').mockResolvedValue(expected)

      expect(await controller.update(1, updateOrderDto)).toEqual(expected)

      expect(service.findOne).toHaveBeenCalledWith(1)
      expect(service.update).toHaveBeenCalledWith(order, updateOrderDto)
    })

    it('should throw an error if order not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null)

      await expect(controller.update(1, {})).rejects.toThrow(NotFoundException)
      expect(service.findOne).toHaveBeenCalledWith(1)
      expect(service.update).not.toHaveBeenCalled()
    })
  })
})
