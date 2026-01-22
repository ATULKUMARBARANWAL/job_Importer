import { useEffect, useState } from "react";
import ImportHistoryTable from "./ImportHistoryTable";
import { getImportLogs } from "../services/importService";
import { getSocket } from "../utils/socket";

export default function ImportHistoryContainer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // REST fetch
    getImportLogs().then(setLogs);

    const socket = getSocket();

    // 🛑 IMPORTANT SAFETY CHECK
    if (!socket) return;

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("import-status", (data) => {
      console.log("📡 Import status:", data);
    });

    socket.on("import-log-update", (newLog) => {
      console.log("🔥 New log received:", newLog);
      setLogs((prev) => [newLog, ...prev]);
    });

    return () => {
      socket.off("import-status");
      socket.off("import-log-update");
    };
  }, []);

  return <ImportHistoryTable logs={logs} />;
}
