import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'

import { QUEUE_ORDER } from './order.const'
import { Order } from './entities/order.entity'

@Injectable()
export class OrderMonthlyProducer {
  constructor(@InjectQueue(QUEUE_ORDER) private orderQueue: Queue) {}

  async publish(order: Order) {
    await this.orderQueue.add(QUEUE_ORDER, {
      year_month: order.created_at.toISOString().slice(0, 7), // YYYY-MM
      store_id: order.store_id,
      status: order.status,
      quantity: order.quantity,
    })
  }
}
