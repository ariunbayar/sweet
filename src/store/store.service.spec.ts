import { Test, TestingModule } from '@nestjs/testing'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Store } from './entities/store.entity'
import { StoreService } from './store.service'

describe('StoreService', () => {
  let service: StoreService
  let repository: Repository<Store>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: getRepositoryToken(Store),
          useValue: {
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<StoreService>(StoreService)
    repository = module.get<Repository<Store>>(getRepositoryToken(Store))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create()', () => {
    it('should create a new store', async () => {
      const createStoreDto = {
        address: '123 Broadway, New York, NY 10007, USA',
        manager_name: 'David Lee',
      }

      jest.spyOn(repository, 'save').mockResolvedValue({
        id: 1,
        ...createStoreDto,
      })

      expect(service.create(createStoreDto)).resolves.toEqual({
        id: 1,
        address: '123 Broadway, New York, NY 10007, USA',
        manager_name: 'David Lee',
      })
    })
  })

  describe('findOne()', () => {
    it('should find a store by id', async () => {
      const store = {
        id: 1,
        address: '123 Broadway, New York, NY 10007, USA',
        manager_name: 'David Lee',
      }

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(store)

      expect(service.findOne(1)).resolves.toEqual(store)
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 })
    })

    it('should return null if store is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null)

      expect(service.findOne(1)).resolves.toBeNull()
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 })
    })
  })
})
