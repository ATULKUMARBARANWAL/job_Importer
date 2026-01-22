import mongoose from "mongoose";

const importLogSchema = new mongoose.Schema(
  {
    fileName: String,
    status: String,
    message: String,
    totalFetched: Number,
    totalImported: Number,
    newJobs: Number,
    updatedJobs: Number,
    failedJobs: [
      {
        jobId: String,
        reason: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ImportLog", importLogSchema);
