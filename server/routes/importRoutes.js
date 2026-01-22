import express from 'express';
const router = express.Router();
import { getImportLogs, triggerManualImport } from '../controllers/importController.js';

router.get('/logs', getImportLogs);
router.post('/trigger', triggerManualImport);
export default router;
