import { Processor, WorkerHost } from '@nestjs/bullmq'
import { InjectRepository } from '@nestjs/typeorm'
import { Job } from 'bullmq'
import { OrderMonthly } from '../report/entities/order_monthly.entity'
import { Repository } from 'typeorm'

@Processor('order')
export class OrderProcessor extends WorkerHost {
  constructor(
    @InjectRepository(OrderMonthly)
    private orderMonthlyRepository: Repository<OrderMonthly>,
  ) {
    super()
  }

  /**
   * Process job data to a monthly report.
   * @param job
   * @returns
   */
  async process(job: Job<any, any, string>): Promise<any> {
    // TODO process jobs in bulk
    const { year_month, store_id, status, quantity } = job.data

    const orderMonthly = await this.orderMonthlyRepository.findOne({
      where: {
        year_month,
        store_id,
        status,
      },
    })

    if (!orderMonthly) {
      await this.orderMonthlyRepository.save({
        year_month,
        store_id,
        status,
        quantity,
      })
    } else {
      orderMonthly.quantity += quantity
      await this.orderMonthlyRepository.save(orderMonthly)
    }

    return {}
  }
}
