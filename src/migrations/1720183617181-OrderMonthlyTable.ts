import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class OrderMonthlyTable1720183617181 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_monthly',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'store_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: [
              'pending',
              'processing',
              'shipped',
              'delivered',
              'cancelled',
              'rejected',
            ],
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'year_month',
            type: 'varchar',
            length: '7',
            isNullable: false,
          },
        ],
      }),
    )
    await queryRunner.createIndex(
      'order_monthly',
      new TableIndex({
        name: 'UQ_order_monthly_store_id_year_month_status',
        columnNames: ['store_id', 'year_month', 'status'],
        isUnique: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order_monthly')
  }
}
