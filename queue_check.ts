import { Queue } from 'bullmq'

async function checkQueueSize(queueName: string) {
  try {
    const queue = new Queue(queueName, { connection: { host: 'redis' } })

    const [
      waitingCount,
      activeCount,
      delayedCount,
      completedCount,
      failedCount,
    ] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getDelayedCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
    ])

    console.log(`Queue: ${queueName}`)
    console.log(`Waiting: ${waitingCount}`)
    console.log(`Active: ${activeCount}`)
    console.log(`Delayed: ${delayedCount}`)
    console.log(`Completed: ${completedCount}`)
    console.log(`Failed: ${failedCount}`)

    await queue.close() // Clean up the connection
  } catch (error) {
    console.error(`Error checking queue: ${error}`)
  }
}

checkQueueSize('order')
