import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  Query,
  NotFoundException,
} from '@nestjs/common'
import { OrderService } from './order.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { PaginationDto } from '../dto/pagination.dto'
import { PaginatedResultDto } from '../dto/paginated-result.dto'
import { Order } from './entities/order.entity'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const { offset, limit } = paginationDto
    const count = await this.orderService.count()
    const orders = await this.orderService.findAll(offset, limit)

    const paginatedResultDto = new PaginatedResultDto<Order>()
    paginatedResultDto.result = orders
    paginatedResultDto.pagination = {
      offset,
      limit,
      total: count,
    }

    return paginatedResultDto
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.orderService.findOne(id)
    if (!order) {
      throw new NotFoundException(`Not found`)
    }
    return order
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const order = await this.orderService.findOne(id)
    if (!order) {
      throw new NotFoundException(`Not found`)
    }
    return this.orderService.update(order, updateOrderDto)
  }
}
