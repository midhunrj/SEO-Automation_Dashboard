// src/queues/auditQueue.js
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const QUEUE_NAME = 'seo-audit-jobs';

let auditQueue = null;
let redisConnection = null;
let isRedisAvailable = false;

// Initialize Redis connection for Upstash or local Redis
const redisUrl = process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL;

if (redisUrl && !redisUrl.includes('placeholder')) {
  try {
    redisConnection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      connectTimeout: 5000
    });

    redisConnection.on('connect', () => {
      console.log('[BullMQ] Successfully connected to Redis');
      isRedisAvailable = true;
    });

    redisConnection.on('error', (err) => {
      console.warn(`[BullMQ Redis Warning: ${err.message}] Running with in-memory execution fallback.`);
      isRedisAvailable = false;
    });

    auditQueue = new Queue(QUEUE_NAME, { connection: redisConnection });
  } catch (err) {
    console.warn(`[BullMQ] Failed to initialize Redis queue: ${err.message}`);
  }
}

/**
 * Add an audit task to the BullMQ queue
 */
async function addAuditJob(data) {
  const jobId = `job_${data.auditId || Date.now()}`;

  if (auditQueue && isRedisAvailable) {
    try {
      const job = await auditQueue.add('process-seo-audit', data, {
        jobId,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000
        },
        removeOnComplete: false,
        removeOnFail: false
      });
      console.log(`[BullMQ] Job ${job.id} enqueued in ${QUEUE_NAME}`);
      return { success: true, jobId: job.id, mode: 'bullmq-redis' };
    } catch (err) {
      console.warn(`[BullMQ] Enqueue error (${err.message}). Triggering in-process pipeline.`);
    }
  }

  // Graceful In-Process / Serverless Fallback
  // Executes asynchronously so HTTP response is returned immediately
  setImmediate(async () => {
    try {
      const { processAuditPipeline } = require('../workers/auditWorker');
      console.log(`[Queue Fallback] Processing audit job ${jobId} asynchronously...`);
      await processAuditPipeline(data);
    } catch (err) {
      console.error(`[Queue Fallback Error] ${err.message}`);
    }
  });

  return { success: true, jobId, mode: 'in-process-runner' };
}

module.exports = {
  QUEUE_NAME,
  auditQueue,
  redisConnection,
  addAuditJob
};
