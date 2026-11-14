import StatusBadge from "./ui/StatusBadge.jsx";
import Button from "./ui/Button.jsx";

export default function TeamCard({
  team,
  onEdit,
  onDelete,
  onStatusChange,
  onScoreIncrement
}) {
  const id = team._id || team.id;
  const STATUS_CYCLE = ["Scheduled", "Live", "Completed"];

  const handleNextStatus = () => {
    if (!onStatusChange) return;
    const currentIdx = STATUS_CYCLE.indexOf(team.status || "Scheduled");
    const nextStatus = STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length];
    onStatusChange(id, nextStatus);
  };

  return (
    <article className="team-card" aria-label={`Team: ${team.name}`}>
      <div>
        <div className="team-card-top">
          <span className="team-sport-pill">{team.sport}</span>
          <button
            type="button"
            onClick={handleNextStatus}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            title="Click to cycle status (Scheduled → Live → Completed)"
          >
            <StatusBadge status={team.status} />
          </button>
        </div>
        <h3 className="team-name">{team.name}</h3>
        <p className="team-city">📍 {team.city || "Unassigned"}</p>
      </div>

      <div className="team-card-center">
        <div>
          <span className="team-points-label">Total Points</span>
          <div className="team-points-box">
            <span className="team-points-num">{team.points || 0}</span>
            <span style={{ fontSize: "0.8rem", color: "var(--ink-muted)", fontWeight: 600 }}>PTS</span>
          </div>
        </div>

        {onScoreIncrement && (
          <div style={{ display: "flex", gap: "0.35rem" }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onScoreIncrement(id, Math.max(0, (team.points || 0) - 1))}
              aria-label={`Decrease points for ${team.name}`}
            >
              -1
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onScoreIncrement(id, (team.points || 0) + 3)}
              aria-label={`Award 3 points to ${team.name}`}
            >
              +3
            </Button>
          </div>
        )}
      </div>

      <div className="team-card-actions">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(team)}
          aria-label={`Edit ${team.name}`}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(team)}
          aria-label={`Delete ${team.name}`}
        >
          Delete
        </Button>
      </div>
    </article>
  );
}
