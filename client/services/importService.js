import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getImportLogs = async () => {
  console.log('Fetching import logs from:', `${API_BASE}/import/logs`);
  const res = await axios.get(`${API_BASE}/import/logs`);
  console.log('Import logs fetched:', res.data);
  return res.data;
};

export const triggerManualImport = async () => {
  await axios.post(`${API_BASE}/import/trigger`);
};
