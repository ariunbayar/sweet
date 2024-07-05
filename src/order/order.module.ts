import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BullModule } from '@nestjs/bullmq'

import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { OrderProcessor } from './order.processor'
import { Order } from './entities/order.entity'
import { OrderMonthly } from '../report/entities/order_monthly.entity'
import { OrderMonthlyProducer } from './order_monthly.producer'
import { QUEUE_ORDER } from './order.const'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderMonthly]),
    BullModule.registerQueue({ name: QUEUE_ORDER }),
  ],
  providers: [OrderService, OrderProcessor, OrderMonthlyProducer],
  controllers: [OrderController],
})
export class OrderModule {}
