import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InventoryService } from './inventory.service'
import { Inventory } from './entities/inventory.entity'

describe('InventoryService', () => {
  let service: InventoryService
  let repository: Repository<Inventory>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<InventoryService>(InventoryService)
    repository = module.get<Repository<Inventory>>(
      getRepositoryToken(Inventory),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  /**
   * mysql> select * from inventory;
    +-----+----------------------+---------------------+----------+
    | id  | name                 | manufactured_at     | quantity |
    +-----+----------------------+---------------------+----------+
    |   2 | ChocolateBarVan      | 2023-10-28 00:00:00 |     4450 |
    |   3 | LollipopRV           | 2023-10-28 00:00:00 |     3420 |
    |   4 | JellyBeanVan         | 2023-10-28 00:00:00 |     3860 |
    |   5 | LollipopTruck        | 2023-10-28 00:00:00 |     1010 |
    */

  describe('create()', () => {
    it('should create a new inventory', async () => {
      const createInventoryDto = {
        name: 'ChocolateBarVan',
        manufactured_at: new Date('2023-10-28T00:00:00.000Z'),
        quantity: 4450,
      }

      jest.spyOn(repository, 'save').mockResolvedValue({
        id: 2,
        ...createInventoryDto,
      })

      expect(service.create(createInventoryDto)).resolves.toEqual({
        id: 2,
        name: 'ChocolateBarVan',
        manufactured_at: new Date('2023-10-28T00:00:00.000Z'),
        quantity: 4450,
      })
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

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(inventory)

      expect(service.findOne(2)).resolves.toEqual(inventory)
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 2 })
    })

    it('should return null if inventory is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null)

      expect(service.findOne(1)).resolves.toBeNull()
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 })
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

      jest.spyOn(repository, 'find').mockResolvedValue(inventories)

      expect(service.findAll(0, 2)).resolves.toEqual(inventories)
      expect(repository.find).toHaveBeenCalledWith({
        skip: 0,
        take: 2,
        order: { id: 'ASC' },
      })
    })
  })

  describe('count()', () => {
    it('should return the count of inventories', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(4)

      expect(service.count()).resolves.toEqual(4)
      expect(repository.count).toHaveBeenCalled()
    })
  })

  describe('update()', () => {
    it('should update an inventory', async () => {
      const inventory = {
        id: 2,
        name: 'ChocolateBarVan',
        manufactured_at: new Date('2023-10-28T00:00:00.000Z'),
        quantity: 4450,
      }
      const updateInventoryDto = {
        name: 'ChocolateBarVan NEW',
        manufactured_at: new Date('2023-10-28T11:11:11.111Z'),
        quantity: 1000,
      }
      const expected = { ...inventory, ...updateInventoryDto }

      jest.spyOn(repository, 'save').mockResolvedValue(expected)

      expect(service.update(inventory, updateInventoryDto)).resolves.toEqual(
        expected,
      )
      expect(repository.save).toHaveBeenCalledWith(expected)
    })

    it('should update partially', async () => {
      const inventory = {
        id: 2,
        name: 'ChocolateBarVan',
        manufactured_at: new Date('2023-10-28T00:00:00.000Z'),
        quantity: 4450,
      }
      const updateInventoryDto = {
        quantity: 1000, // Only updating the quantity
      }
      const expected = { ...inventory, ...updateInventoryDto }

      jest.spyOn(repository, 'save').mockResolvedValue(expected)

      expect(service.update(inventory, updateInventoryDto)).resolves.toEqual(
        expected,
      )
      expect(repository.save).toHaveBeenCalledWith(expected)
    })
  })
})
