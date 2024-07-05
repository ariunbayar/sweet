import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Index } from 'typeorm'
import { OrderStatus } from '../../order/enums/order-status.enum' // TODO #51

@Entity('order_monthly')
@Index(['store_id', 'year_month', 'status'], { unique: true })
export class OrderMonthly {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number

  @Column({ type: 'int', unsigned: true })
  store_id: number

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus

  @Column({ type: 'int', unsigned: true })
  quantity: number

  @Column({ type: 'varchar', length: 7 })
  year_month: string
}
