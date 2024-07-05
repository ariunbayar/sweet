import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BullModule } from '@nestjs/bullmq'

import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { OrderProcessor } from './order.processor'
import { Order } from './entities/order.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    BullModule.registerQueue({
      name: 'order',
    }),
  ],
  providers: [OrderService, OrderProcessor],
  controllers: [OrderController],
})
export class OrderModule {}
