import { Queue } from 'bullmq';

console.log("🔄 jobQueue.js is loading...");

let jobQueue;
try {
  jobQueue = new Queue('jobQueue', {
    connection: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  });
  console.log("✅ YoYo Queue initialized");
} catch (err) {
  console.error("❌ Failed to initialize job queue:", err);
}

export default jobQueue;
