import { Test, TestingModule } from '@nestjs/testing'
import { Job } from 'bullmq'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { OrderMonthly } from '../report/entities/order_monthly.entity'
import { OrderProcessor } from './order.processor'

const oneJob: Job<any, any, string> = {
  data: {
    year_month: '2023-03',
    store_id: 1,
    status: 'PENDING',
    quantity: 5,
  },
} as Job<any, any, string>

describe('OrderProcessor', () => {
  let processor: OrderProcessor
  let orderMonthlyRepository: Repository<OrderMonthly>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProcessor,
        {
          provide: getRepositoryToken(OrderMonthly),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile()

    processor = module.get<OrderProcessor>(OrderProcessor)
    orderMonthlyRepository = module.get<Repository<OrderMonthly>>(
      getRepositoryToken(OrderMonthly),
    )
  })

  it('should create a new order monthly report if it does not exist', async () => {
    jest.spyOn(orderMonthlyRepository, 'findOne').mockResolvedValue(null)

    await processor.process(oneJob)

    expect(orderMonthlyRepository.save).toHaveBeenCalledWith({
      year_month: '2023-03',
      store_id: 1,
      status: 'PENDING',
      quantity: 5,
    })
  })

  it('should update an existing order monthly report', async () => {
    const existingOrderMonthly: OrderMonthly = {
      id: 1,
      year_month: oneJob.data.year_month,
      store_id: oneJob.data.store_id,
      status: oneJob.data.status,
      quantity: 3,
    }

    jest
      .spyOn(orderMonthlyRepository, 'findOne')
      .mockResolvedValue(existingOrderMonthly)

    await processor.process(oneJob)

    expect(orderMonthlyRepository.save).toHaveBeenCalledWith({
      ...existingOrderMonthly,
      quantity: 8,
    })
  })
})
