import { MigrationInterface, QueryRunner } from 'typeorm'

export class InventoryTable1720046144917 implements MigrationInterface {
  name = 'InventoryTable1720046144917'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`inventory\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`manufactured_at\` datetime NOT NULL,
        \`quantity\` int NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE = InnoDB
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE \`inventory\`
    `)
  }
}
