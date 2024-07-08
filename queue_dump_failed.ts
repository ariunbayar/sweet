import { Queue } from 'bullmq'

async function dumpFailedJobs(queueName: string) {
  try {
    const queue = new Queue(queueName, { connection: { host: 'redis' } })

    const failedJobs = await queue.getFailed()

    for (const job of failedJobs) {
      console.log('Failed Job:')
      console.log(`  ID: ${job.id}`)
      console.log(`  Data: ${JSON.stringify(job.data)}`)
      console.log(`  Error: ${job.stacktrace}`)
      console.log('---')
    }

    await queue.close() // Clean up the connection
  } catch (error) {
    console.error(`Error checking queue: ${error}`)
  }
}

dumpFailedJobs('order')
