import { Test, TestingModule } from '@nestjs/testing'
import { InventoryController } from './inventory.controller'
import { InventoryService } from './inventory.service'
import { NotFoundException } from '@nestjs/common'

describe('InventoryController', () => {
  let controller: InventoryController
  let service: InventoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
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

    controller = module.get<InventoryController>(InventoryController)
    service = module.get<InventoryService>(InventoryService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create()', () => {
    it('should create a new inventory', async () => {
      const createInventoryDto = {
        name: 'ChocolateBarVan',
        manufactured_at: new Date('2023-10-28T00:00:00.000Z'),
        quantity: 4450,
      }

      jest.spyOn(service, 'create').mockResolvedValue({
        id: 2,
        ...createInventoryDto,
      })

      expect(controller.create(createInventoryDto)).resolves.toEqual({
        id: 2,
        name: 'ChocolateBarVan',
        manufactured_at: new Date('2023-10-28T00:00:00.000Z'),
        quantity: 4450,
      })
      expect(service.create).toHaveBeenCalledWith(createInventoryDto)
    })
  })

  describe('findOne()', () => {
    it('should find an inventory by id', async () => {
      const inventory = {
        id: 2,
        name: 'ChocolateBarVan',
        manufactured_at: new Date('2023-10-28T00:00:00.000Z'),
        quantity: 4450,
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(inventory)

      expect(controller.findOne(2)).resolves.toEqual(inventory)
      expect(service.findOne).toHaveBeenCalledWith(2)
    })

    it('throws an error if inventory is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null)

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException)
      expect(service.findOne).toHaveBeenCalledWith(1)
    })
  })

  describe('findAll()', () => {
    it('should find all inventories', async () => {
      const inventories = [
        {
          id: 4,
          name: 'JellyBeanVan',
          manufactured_at: new Date('2023-10-28T00:00:00.000Z'),
          quantity: 3860,
        },
        {
          id: 5,
          name: 'LollipopTruck',
          manufactured_at: new Date('2023-10-28T00:00:00.000Z'),
          quantity: 1010,
        },
      ]

      jest.spyOn(service, 'count').mockResolvedValue(2)
      jest.spyOn(service, 'findAll').mockResolvedValue(inventories)

      expect(await controller.findAll({ offset: 0, limit: 10 })).toEqual({
        result: inventories,
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
    it('should update an inventory', async () => {
      const inventory = {
        id: 2,
        name: 'ChocolateBarVan',
        manufactured_at: new Date('2023-10-28T00:00:00.000Z'),
        quantity: 1000,
      }

      const updateInventoryDto = {
        name: 'ChocolateBarVan NEW',
        manufactured_at: new Date('2023-10-28T00:00:00.111Z'),
        quantity: 4450,
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(inventory)
      jest.spyOn(service, 'update').mockResolvedValue({
        ...inventory,
        ...updateInventoryDto,
      })

      expect(await controller.update(2, updateInventoryDto)).toEqual({
        id: 2,
        name: 'ChocolateBarVan NEW',
        manufactured_at: new Date('2023-10-28T00:00:00.111Z'),
        quantity: 4450,
      })
      expect(service.findOne).toHaveBeenCalledWith(2)
      expect(service.update).toHaveBeenCalledWith(inventory, updateInventoryDto)
    })

    it('should allow partial update', async () => {
      const inventory = {
        id: 2,
        name: 'ChocolateBarVan',
        manufactured_at: new Date('2023-10-28T00:00:00.000Z'),
        quantity: 1000,
      }

      const updateInventoryDto = { quantity: 4450 }

      jest.spyOn(service, 'findOne').mockResolvedValue(inventory)
      jest.spyOn(service, 'update').mockResolvedValue({
        ...inventory,
        ...updateInventoryDto,
      })

      expect(await controller.update(2, updateInventoryDto)).toEqual({
        id: 2,
        name: 'ChocolateBarVan',
        manufactured_at: new Date('2023-10-28T00:00:00.000Z'),
        quantity: 4450, // Updated quantity
      })
      expect(service.findOne).toHaveBeenCalledWith(2)
      expect(service.update).toHaveBeenCalledWith(inventory, updateInventoryDto)
    })

    it('throws an error if inventory is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null)

      await expect(controller.update(1, {})).rejects.toThrow(NotFoundException)
      expect(service.findOne).toHaveBeenCalledWith(1)
      expect(service.update).not.toHaveBeenCalled()
    })
  })
})
