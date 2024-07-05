import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DataSource } from 'typeorm'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CustomerModule } from './customer/customer.module'
import { StoreModule } from './store/store.module'
import { InventoryModule } from './inventory/inventory.module'
import { OrderModule } from './order/order.module'
import { ReportModule } from './report/report.module'
import typeorm from './config/typeorm'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get('typeorm'),
        autoLoadEntities: true,
        synchronize: false, // Disable auto-sync in production
        migrationsRun: false,
        logging: process.env.APP_ENV === 'development',
      }),
    }),
    CustomerModule,
    StoreModule,
    InventoryModule,
    OrderModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
