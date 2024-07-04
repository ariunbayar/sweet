import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'datetime' })
  manufactured_at: Date

  @Column({ type: 'int', unsigned: true })
  quantity: number
}
