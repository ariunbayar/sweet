import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Store {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number

  @Column({ type: 'varchar', length: 255 })
  address: string

  @Column({ type: 'varchar', length: 255 })
  manager_name: string
}
