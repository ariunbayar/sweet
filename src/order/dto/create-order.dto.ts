import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { OrderStatus } from '../enums/order-status.enum'

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  customer_id: number

  @IsNumber()
  @IsNotEmpty()
  inventory_id: number

  @IsNumber()
  @IsNotEmpty()
  store_id: number

  @IsNumber()
  @IsNotEmpty()
  quantity: number

  @IsString()
  @IsNotEmpty()
  status: OrderStatus
}
