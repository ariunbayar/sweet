import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'

@Processor('order')
export class OrderProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    // TODO implement order processing logic
    console.log('job.data:', job.data)
    return {}
  }
}
