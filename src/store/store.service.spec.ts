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
})
