import ImportLog from '../models/ImportLog.js';
import jobQueue from '../queues/jobQueue.js';

/**
 * GET /api/import/logs
 * Fetch import history logs (latest first)
 */
export const getImportLogs = async (req, res) => {
  try {
    console.log('📥 Fetching import logs...');

    const logs = await ImportLog
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    console.error('❌ Error fetching import logs:', err.message);
    res.status(500).json({ error: 'Failed to fetch import logs' });
  }
};

/**
 * POST /api/import/trigger
 * Triggers manual background import job
 */
export const triggerManualImport = async (req, res) => {
  try {
    console.log('🚀 Manual import triggered');

    // Add job to BullMQ
    await jobQueue.add('fetchJobs', {
      triggeredBy: 'manual',
      triggeredAt: new Date(),
    });

    // 🔥 Emit socket event (job started)
    if (global.io) {
      global.io.emit('import-status', {
        status: 'started',
        message: 'Manual import job started',
        timestamp: new Date(),
      });
    }

    res.status(200).json({
      message: 'Manual job import triggered successfully',
    });

  } catch (err) {
    console.error('❌ Error triggering import job:', err.message);
    res.status(500).json({ error: 'Failed to trigger import job' });
  }
};
