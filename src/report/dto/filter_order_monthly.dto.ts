import { IsOptional, IsString, IsArray, IsInt, IsEnum } from 'class-validator'
import { OrderStatus } from '../../common/enums/order-status.enum'

export class FilterOrderMonthlyDto {
  @IsString()
  year_month_min: string

  @IsString()
  year_month_max: string

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  store_ids?: number[]

  @IsArray()
  @IsOptional()
  @IsEnum(OrderStatus, { each: true })
  status_list?: OrderStatus[]
}
