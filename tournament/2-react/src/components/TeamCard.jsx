export default function TeamCard({ team, onDelete, onStatusChange, onPointsChange }) {
  const STATUSES = ["Scheduled", "Live", "Completed"];

  function handleStatusClick() {
    const nextIdx = (STATUSES.indexOf(team.status) + 1) % STATUSES.length;
    onStatusChange(team._id || team.id, STATUSES[nextIdx]);
  }

  return (
    <div className="team-card">
      <div className="team-card-header">
        <div>
          <h3 className="team-title">{team.name}</h3>
          <span className="sport-tag">{team.sport}</span>
        </div>
        <button
          className={`pill ${team.status}`}
          onClick={handleStatusClick}
          title="Click to toggle status"
        >
          {team.status === "Live" ? "● " : ""}{team.status}
        </button>
      </div>

      <div className="team-card-body">
        <span>📍 {team.city || "Headquarters"}</span>
        <div className="points-display">
          <button
            className="btn-mini"
            onClick={() => onPointsChange(team._id || team.id, Math.max(0, (team.points || 0) - 1))}
          >
            -
          </button>
          <span>{team.points || 0} pts</span>
          <button
            className="btn-mini"
            onClick={() => onPointsChange(team._id || team.id, (team.points || 0) + 3)}
          >
            +
          </button>
        </div>
      </div>

      <div className="team-card-footer">
        <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
          ID: {String(team._id || team.id).slice(-6)}
        </span>
        <button
          className="btn-delete"
          onClick={() => {
            if (window.confirm(`Remove "${team.name}" from tournament?`)) {
              onDelete(team._id || team.id);
            }
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
