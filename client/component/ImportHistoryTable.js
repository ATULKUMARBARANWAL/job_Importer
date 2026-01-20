import styles from "./ImportHistoryTable.module.css";

export default function ImportHistoryTable({ logs = [], page = 1, limit = 10 }) {
  if (!logs.length) {
    return (
      <div className={styles.empty}>
        📭 No import history found
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "success":
        return styles.success;
      case "partial":
        return styles.partial;
      case "failed":
        return styles.failed;
      default:
        return "";
    }
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>S.No.</th>
          <th>Status</th>
          <th>Message</th>
          <th>Total</th>
          <th>New</th>
          <th>Updated</th>
          <th>Failed</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {logs.map((log, index) => (
          <tr key={log._id || index}>
            {/* Pagination-safe serial number */}
            <td>{(page - 1) * limit + index + 1}</td>

            <td>
              <span className={`${styles.badge} ${getStatusClass(log.status)}`}>
                {log.status}
              </span>
            </td>

            <td>{log.message || "-"}</td>

            <td>{log.totalFetched ?? 0}</td>

            <td>{log.newJobs ?? 0}</td>

            <td>{log.updatedJobs ?? 0}</td>

            <td>{log.failedJobs?.length ?? 0}</td>

            <td>
              {log.createdAt
                ? new Date(log.createdAt).toLocaleString()
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
