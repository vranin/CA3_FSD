export default function StatusBadge({ status = "Scheduled", className = "" }) {
  const norm = String(status || "Scheduled").toLowerCase();

  return (
    <span className={`status-badge ${norm} ${className}`.trim()} aria-label={`Status: ${status}`}>
      <span className="status-badge-inner">
        {norm === "live" && <span className="pulse-dot" aria-hidden="true" />}
        {status}
      </span>
    </span>
  );
}
