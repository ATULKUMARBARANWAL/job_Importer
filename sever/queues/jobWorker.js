// queues/jobWorker.js
import { Worker } from "bullmq";
import Job from "../models/Job.js";
import ImportLog from "../models/ImportLog.js";

console.log("👷 Job worker started");

const worker = new Worker(
  "jobQueue", // ✅ MUST match queue name
  async ({ data }) => {
    const { job, importLogId } = data;

    try {
      console.log("👷 Processing job:", job.title?.[0]);

      // 1️⃣ Extract unique job identifier
      const jobId = job.guid?.[0]?._ || job.link?.[0];
      if (!jobId) {
        throw new Error("Job ID not found");
      }

      // 2️⃣ Check if job already exists
      const existing = await Job.findOne({ jobId });

      // 3️⃣ Upsert job
      await Job.updateOne(
        { jobId },
        {
          jobId,
          title: job.title?.[0],
          description: job.description?.[0],
          location: job["job_listing:location"]?.[0] || "Remote",
          company: job["job_listing:company"]?.[0] || "Unknown",
          jobType: job["job_listing:job_type"]?.[0] || "Full Time",
          postedAt: new Date(job.pubDate?.[0] || Date.now()),
        },
        { upsert: true }
      );

      // 4️⃣ Update batch counters atomically
      await ImportLog.findByIdAndUpdate(importLogId, {
        $inc: existing ? { updatedJobs: 1 } : { newJobs: 1 },
      });

      // 5️⃣ FINALIZE batch if all jobs are processed
      const log = await ImportLog.findById(importLogId);

      if (
        log &&
        log.totalFetched ===
          log.newJobs + log.updatedJobs + log.failedJobs.length
      ) {
        await ImportLog.findByIdAndUpdate(importLogId, {
          status: log.failedJobs.length > 0 ? "partial" : "success",
          message: "Job import completed",
          totalImported: log.newJobs + log.updatedJobs,
        });

        console.log("✅ Import batch completed:", importLogId);
      }

      return existing ? "updated" : "created";
    } catch (err) {
      console.error("❌ Worker error:", err.message);

      // 6️⃣ Track failed job in SAME batch
      await ImportLog.findByIdAndUpdate(importLogId, {
        $push: {
          failedJobs: {
            reason: err.message,
          },
        },
      });

      // 7️⃣ Retry support (BullMQ)
      throw err;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    concurrency: 5,
  }
);

// Optional logs (nice for debugging)
worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});
