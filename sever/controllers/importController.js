import ImportLog from '../models/ImportLog.js';
import jobQueue from '../queues/jobQueue.js';
/**
 * GET /api/import/logs
 * Returns a list of import history logs sorted by newest first.
 */
export const getImportLogs = async (req, res) => {
  try {
    console.log('📥 Fetching import logs...');
    const logs = await ImportLog.find().sort({ createdAt: -1 }); // Ensure timestamps:true in schema
   
    res.status(200).json(logs);
  } catch (err) {
    console.error('❌ Error fetching import logs:', err.message);
    res.status(500).json({ error: 'Failed to fetch import logs' });
  }
};

/**
 * POST /api/import/trigger
 * Triggers the background job to fetch/import data manually.
 */
export const triggerManualImport = async (req, res) => {
  try {
    console.log('🚀 Manual import triggered');
    
    // Add job to queue — job handler should log ImportLog on success/failure
    await jobQueue.add('fetchJobs', {}); 

    res.status(200).json({ message: 'Manual job import triggered successfully' });
  } catch (err) {
    console.error('❌ Error triggering import job:', err.message);
    res.status(500).json({ error: 'Failed to trigger import job' });
  }
};

