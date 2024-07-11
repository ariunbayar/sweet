import { Processor, WorkerHost } from '@nestjs/bullmq'
import { InjectRepository } from '@nestjs/typeorm'
import { Job } from 'bullmq'
import { OrderMonthly } from '../report/entities/order_monthly.entity'
import { Repository } from 'typeorm'
import { OrderStatus } from 'src/common/enums/order-status.enum'
import { v4 as uuidv4 } from 'uuid'

interface Update {
  year_month: string
  store_id: number
  status: OrderStatus
  quantity: number
}

interface TokenJob {
  token: string
  job: Job<any, any, string>
}

@Processor('order')
export class OrderProcessor extends WorkerHost {
  constructor(
    @InjectRepository(OrderMonthly)
    private orderMonthlyRepository: Repository<OrderMonthly>,
  ) {
    super()
  }

  async save_monthly_report(updates: Update[]) {
    // TODO cleanup
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // sum update quantities by year_month, store_id and status
    const updates_by_year_month_store_id_status: { [key: string]: Update } =
      updates.reduce(
        (acc, update) => {
          const { year_month, store_id, status } = update
          const key = `${year_month}-${store_id}-${status}`

          if (!acc[key]) {
            acc[key] = {
              year_month,
              store_id,
              status,
              quantity: 0,
            }
          }

          acc[key].quantity += update.quantity

          return acc
        },
        {} as { [key: string]: Update },
      )

    // TODO execute in transaction
    // save each update
    for (const key in updates_by_year_month_store_id_status) {
      await this.save_update(updates_by_year_month_store_id_status[key])
    }
  }

  async save_update(update: Update) {
    const { year_month, store_id, status, quantity } = update
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
  }

  async getJobs(amount: number): Promise<TokenJob[]> {
    const tjobs = []
    const token = uuidv4()

    while (amount > 0) {
      const tjob: TokenJob = await this.worker
        .getNextJob(`${token}-${amount}`)
        .then((job) => ({ token: `${token}-${amount}`, job }))

      if (tjob.job) {
        tjobs.push(tjob)
      }

      amount--
    }

    return tjobs
  }

  async moveJobsCompleted(tjobs: TokenJob[]) {
    // parallel
    // await Promise.all(
    //   tjobs.map((tjob) => tjob.job.moveToCompleted({}, tjob.token, false)),
    // )

    // serial
    for (const tjob of tjobs) {
      await tjob.job.moveToCompleted({}, tjob.token, false)
    }
  }

  async moveJobsFailed(tjobs: TokenJob[], err: Error) {
    // parallel
    // await Promise.all(
    //   tjobs.map((tjob) => tjob.job.moveToFailed(err, tjob.token, false)),
    // )

    // serial
    for (const tjob of tjobs) {
      await tjob.job.moveToFailed(err, tjob.token, false)
    }
  }

  /**
   * Process job data along with other pending jobs to monthly report.
   * @param job
   * @returns
   */
  async process(job: Job<any, any, string>): Promise<any> {
    const tjobs: TokenJob[] = await this.getJobs(200) // batch size

    const updates: Update[] = [job.data, ...tjobs.map((tjob) => tjob.job.data)]

    try {
      this.save_monthly_report(updates)

      await this.moveJobsCompleted(tjobs)
    } catch (error) {
      console.log(error)
      console.log(error.stacktrace)

      await this.moveJobsCompleted(tjobs)

      // allows the main job to move into failed state
      throw new Error(error)
    }
  }
}
