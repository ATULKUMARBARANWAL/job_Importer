// cron.js
import cron from "node-cron";
import jobQueue from "./queues/jobQueue.js";
import fetchJobs from "./services/fetchJobs.js";
import ImportLog from "./models/ImportLog.js";

console.log("🔄 cron.js is loading...");

cron.schedule("* * * * *", async () => {
  try {
    console.log("⏰ Cron triggered");

    // 1️⃣ Fetch jobs from external API
    const jobs = await fetchJobs();
    console.log(`📦 Jobs fetched: ${jobs.length}`);

    // 2️⃣ Create ONE import log for this run (BATCH)
    const importLog = await ImportLog.create({
      status: "processing",
      message: "Job import started",
      totalFetched: jobs.length,
      totalImported: 0,
      newJobs: 0,
      updatedJobs: 0,
      failedJobs: [],
    });

    // 3️⃣ Push jobs to queue WITH batch reference
    for (const job of jobs) {
      console.log("📤 Adding job to queue:", job.title?.[0]);

      await jobQueue.add("import-job", {
        job,
        importLogId: importLog._id, // 🔑 CRITICAL FIX
      });
    }

    console.log("✅ Jobs pushed to queue");
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
});
