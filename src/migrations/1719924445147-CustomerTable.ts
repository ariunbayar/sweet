import { MigrationInterface, QueryRunner } from 'typeorm'

export class CustomerTable1719924445147 implements MigrationInterface {
  name = 'CustomerTable1719924445147'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`customer\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE \`customer\`
        `)
  }
}
