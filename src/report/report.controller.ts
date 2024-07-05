import { Controller, Get, Query } from '@nestjs/common'

import { ReportService } from './report.service'
import { FilterOrderMonthlyDto } from './dto/filter_order_monthly.dto'

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async findAllOrderMonthly(
    @Query() filterOrderMonthlyDto: FilterOrderMonthlyDto,
  ) {
    return this.reportService.findAllOrderMonthly(filterOrderMonthlyDto)
  }
}
