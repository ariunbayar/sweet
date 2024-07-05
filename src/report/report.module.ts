import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReportController } from './report.controller'
import { ReportService } from './report.service'
import { OrderMonthly } from './entities/order_monthly.entity'

@Module({
  imports: [TypeOrmModule.forFeature([OrderMonthly])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
