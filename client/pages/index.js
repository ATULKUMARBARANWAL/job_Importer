// pages/index.js
import ImportHistoryTable from '../component/ImportHistoryTable';
import { getImportLogs } from '../services/importService';
import { useEffect, useState } from 'react';

export default function Home() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const data = await getImportLogs();
        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      }
    }

    fetchLogs();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Import History</h2>
      <ImportHistoryTable logs={logs} />
    </div>
  );
}
