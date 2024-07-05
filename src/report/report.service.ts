import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { OrderMonthly } from './entities/order_monthly.entity'
import { FilterOrderMonthlyDto } from './dto/filter_order_monthly.dto'

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(OrderMonthly)
    private orderMonthlyRepo: Repository<OrderMonthly>,
  ) {}

  async findAllOrderMonthly(filterOrderMonthlyDto: FilterOrderMonthlyDto) {
    const { year_month_min, year_month_max, store_ids, status_list } =
      filterOrderMonthlyDto

    const builder = this.orderMonthlyRepo.createQueryBuilder('t')

    builder
      .select('t.year_month', 'year_month')
      .addSelect('t.store_id', 'store_id')
      .addSelect('t.status', 'status')
      .addSelect('t.quantity', 'quantity')

    builder
      .where('t.year_month >= :year_month_min', { year_month_min })
      .andWhere('t.year_month <= :year_month_max', { year_month_max })

    if (store_ids) {
      builder.andWhere('t.store_id IN (:...store_ids)', { store_ids })
    }
    if (status_list) {
      builder.andWhere('t.status IN (:...status_list)', { status_list })
    }

    return builder.getRawMany() // bypass hydration
  }
}
