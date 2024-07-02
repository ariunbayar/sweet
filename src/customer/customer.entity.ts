import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Customer {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number

  @Column({ type: 'varchar', length: 255 })
  name: string
}
