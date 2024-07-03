import { Test, TestingModule } from '@nestjs/testing'
import { StoreController } from './store.controller'
import { StoreService } from './store.service'

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
})
