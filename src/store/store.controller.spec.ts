import { Test, TestingModule } from '@nestjs/testing'
import { StoreController } from './store.controller'
import { StoreService } from './store.service'
import { NotFoundException } from '@nestjs/common'

describe('StoreController', () => {
  let controller: StoreController
  let service: StoreService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        {
          provide: StoreService,
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

    controller = module.get<StoreController>(StoreController)
    service = module.get<StoreService>(StoreService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create()', () => {
    it('should create a new store', async () => {
      const createStoreDto = {
        address: '123 Broadway, New York, NY 10007, USA',
        manager_name: 'David Lee',
      }

      jest.spyOn(service, 'create').mockResolvedValue({
        id: 1,
        ...createStoreDto,
      })

      expect(controller.create(createStoreDto)).resolves.toEqual({
        id: 1,
        address: '123 Broadway, New York, NY 10007, USA',
        manager_name: 'David Lee',
      })
      expect(service.create).toHaveBeenCalledWith(createStoreDto)
    })
  })

  describe('findOne()', () => {
    it('should find a store by id', async () => {
      const store = {
        id: 1,
        address: '123 Broadway, New York, NY 10007, USA',
        manager_name: 'David Lee',
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(store)

      expect(controller.findOne(1)).resolves.toEqual(store)
      expect(service.findOne).toHaveBeenCalledWith(1)
    })

    it('throws an error if store is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null)

      await expect(controller.findOne(2)).rejects.toThrow(NotFoundException)
      expect(service.findOne).toHaveBeenCalledWith(2)
    })
  })

  describe('findAll()', () => {
    it('should find all stores', async () => {
      const stores = [
        {
          id: 1,
          address: '123 Broadway, New York, NY 10007, USA',
          manager_name: 'David Lee',
        },
        {
          id: 2,
          address: '456 Broadway, New York, NY 10007, USA',
          manager_name: 'John Doe',
        },
      ]

      jest.spyOn(service, 'findAll').mockResolvedValue(stores)
      jest.spyOn(service, 'count').mockResolvedValue(2)

      expect(await controller.findAll({ offset: 0, limit: 10 })).toEqual({
        result: stores,
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
    it('should update a store', async () => {
      const updateStoreDto = {
        address: 'New address',
        manager_name: 'New manager name',
      }

      const store = {
        id: 1,
        address: '123 Broadway, New York, NY 10007, USA',
        manager_name: 'David Lee',
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(store)
      jest.spyOn(service, 'update').mockResolvedValue({
        id: 1,
        ...updateStoreDto,
      })

      expect(await controller.update(1, updateStoreDto)).toEqual({
        id: 1,
        address: 'New address',
        manager_name: 'New manager name',
      })

      expect(service.findOne).toHaveBeenCalledWith(1)
      expect(service.update).toHaveBeenCalledWith(store, updateStoreDto)
    })

    it('updates partially', async () => {
      const store = {
        id: 1,
        address: '123 Broadway, New York, NY 10007, USA',
        manager_name: 'David Lee',
      }
      const updateStoreDto = {
        manager_name: 'Mia Taylor',
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(store)
      jest.spyOn(service, 'update').mockResolvedValue({
        id: 1,
        address: '123 Broadway, New York, NY 10007, USA',
        manager_name: 'Mia Taylor',
      })

      expect(await controller.update(1, updateStoreDto)).toEqual({
        id: 1,
        address: '123 Broadway, New York, NY 10007, USA',
        manager_name: 'Mia Taylor',
      })

      expect(service.findOne).toHaveBeenCalledWith(1)
      expect(service.update).toHaveBeenCalledWith(store, updateStoreDto)
    })

    it('throws an error if store is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null)

      await expect(controller.update(2, {})).rejects.toThrow(NotFoundException)

      expect(service.findOne).toHaveBeenCalledWith(2)
      expect(service.update).not.toHaveBeenCalled()
    })
  })
})
