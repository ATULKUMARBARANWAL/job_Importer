// queues/jobWorker.js
import { Worker } from "bullmq";
import Job from "../models/Job.js";
import ImportLog from "../models/ImportLog.js";

console.log("👷 Job worker started");

const worker = new Worker(
  "jobQueue",
  async ({ data }) => {
    const { job, importLogId } = data;

    try {
      console.log("👷 Processing job:", job.title?.[0]);

      const jobId = job.guid?.[0]?._ || job.link?.[0];
      if (!jobId) {
        throw new Error("Job ID not found");
      }

      const existing = await Job.findOne({ jobId });

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

      // 🔢 Update counters
      await ImportLog.findByIdAndUpdate(importLogId, {
        $inc: existing ? { updatedJobs: 1 } : { newJobs: 1 },
      });

      const log = await ImportLog.findById(importLogId);

      // 🔥 REAL-TIME PROGRESS UPDATE
      if (global.io && log) {
        global.io.emit("import-progress", {
          importLogId,
          newJobs: log.newJobs,
          updatedJobs: log.updatedJobs,
          failed: log.failedJobs.length,
          totalFetched: log.totalFetched,
        });
      }

      // ✅ Finalize batch
      if (
        log &&
        log.totalFetched ===
          log.newJobs + log.updatedJobs + log.failedJobs.length
      ) {
        const finalLog = await ImportLog.findByIdAndUpdate(
          importLogId,
          {
            status: log.failedJobs.length > 0 ? "partial" : "success",
            message: "Job import completed",
            totalImported: log.newJobs + log.updatedJobs,
          },
          { new: true }
        );

        console.log("✅ Import batch completed:", importLogId);

        // 🔥 FINAL REAL-TIME UPDATE
        if (global.io) {
          global.io.emit("import-log-update", finalLog);
        }
      }

      return existing ? "updated" : "created";
    } catch (err) {
      console.error("❌ Worker error:", err.message);

      await ImportLog.findByIdAndUpdate(importLogId, {
        $push: {
          failedJobs: {
            reason: err.message,
          },
        },
      });

      // 🔥 REAL-TIME FAILURE UPDATE
      if (global.io) {
        global.io.emit("import-error", {
          importLogId,
          error: err.message,
        });
      }

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

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});
