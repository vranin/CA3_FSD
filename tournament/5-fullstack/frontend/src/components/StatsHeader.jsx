export default function StatsHeader({ teams }) {
  const total = teams.length;
  const live = teams.filter(t => t.status === "Live").length;
  const points = teams.reduce((acc, t) => acc + (t.points || 0), 0);
  const sports = new Set(teams.map(t => t.sport).filter(Boolean)).size;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-label">Total Teams</span>
        <span className="stat-val">{total}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Matches Live</span>
        <span className="stat-val" style={{ color: "#10b981" }}>{live}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Total Points</span>
        <span className="stat-val" style={{ color: "#f59e0b" }}>{points}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Sports Disciplines</span>
        <span className="stat-val" style={{ color: "#6366f1" }}>{sports}</span>
      </div>
    </div>
  );
}
