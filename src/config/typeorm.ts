import 'dotenv/config' // Load .env file
import { registerAs } from '@nestjs/config'
import { DataSourceOptions } from 'typeorm'
import { DataSource } from 'typeorm'

const datasourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'db',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
}

export default registerAs('typeorm', () => datasourceOptions)
export const connectionSource = new DataSource(datasourceOptions)
