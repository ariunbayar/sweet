import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { OrderStatus } from '../enums/order-status.enum'

@Entity()
export class Order {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number

  @Column({ type: 'int', unsigned: true })
  customer_id: number

  @Column({ type: 'int', unsigned: true })
  inventory_id: number

  @Column({ type: 'int', unsigned: true })
  store_id: number

  @Column({ type: 'int', unsigned: true })
  quantity: number

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date
}
