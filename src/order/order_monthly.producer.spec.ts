import { Test, TestingModule } from '@nestjs/testing'
import { Queue } from 'bullmq'
import { OrderMonthlyProducer } from './order_monthly.producer'
import { QUEUE_ORDER } from './order.const'
import { Order } from './entities/order.entity'
import { OrderStatus } from '../common/enums/order-status.enum'
import { getQueueToken } from '@nestjs/bullmq'

const oneOrder: Order = {
  id: 1,
  customer_id: 1,
  store_id: 2,
  inventory_id: 3,
  quantity: 5,
  status: OrderStatus.PENDING,
  created_at: new Date('2021-01-01T00:00:00Z'),
  updated_at: new Date('2021-01-01T00:00:00Z'),
}

describe('OrderMonthlyProducer', () => {
  let producer: OrderMonthlyProducer
  let orderQueue: Queue

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderMonthlyProducer,
        {
          provide: getQueueToken(QUEUE_ORDER),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile()

    producer = module.get<OrderMonthlyProducer>(OrderMonthlyProducer)
    orderQueue = module.get<Queue>(getQueueToken(QUEUE_ORDER))
  })

  it('should publish an order to the queue', async () => {
    await producer.publish(oneOrder)

    expect(orderQueue.add).toHaveBeenCalledWith(QUEUE_ORDER, {
      year_month: '2021-01',
      store_id: 2,
      status: 'pending',
      quantity: 5,
    })
  })
})
