import { MigrationInterface, QueryRunner } from 'typeorm'

export class StoreTable1720023538260 implements MigrationInterface {
  name = 'StoreTable1720023538260'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE \`store\` (
          \`id\` bigint NOT NULL AUTO_INCREMENT,
          \`address\` varchar(255) NOT NULL,
          \`manager_name\` varchar(255) NOT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE = InnoDB
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE \`store\`
    `)
  }
}
