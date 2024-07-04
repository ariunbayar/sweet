import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Order } from './entities/order.entity'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order()
    order.customer_id = createOrderDto.customer_id
    order.inventory_id = createOrderDto.inventory_id
    order.store_id = createOrderDto.store_id
    order.quantity = createOrderDto.quantity
    order.status = createOrderDto.status
    return this.orderRepository.save(order)
  }

  findOne(id: number): Promise<Order | null> {
    return this.orderRepository.findOneBy({ id })
  }

  findAll(offset: number, limit: number): Promise<Order[]> {
    return this.orderRepository.find({
      skip: offset,
      take: limit,
      order: { id: 'ASC' },
    })
  }

  count(): Promise<number> {
    return this.orderRepository.count()
  }

  update(order: Order, updateOrderDto: UpdateOrderDto): Promise<Order> {
    order = { ...order, ...updateOrderDto }
    return this.orderRepository.save(order)
  }
}
