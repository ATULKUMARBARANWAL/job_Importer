import mongoose from 'mongoose';
const jobSchema = new mongoose.Schema({
  jobId: { type: String, unique: true, required: true },
  title: String,
  description: String,
  location: String,
  company: String,
  jobType: String,
  postedAt: Date,
  image: String,
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);