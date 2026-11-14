import StatusBadge from "./ui/StatusBadge.jsx";

export default function DataTable({
  teams = [],
  sortKey = "points",
  sortOrder = "desc",
  onSort
}) {
  return (
    <div className="table-wrapper">
      <table className="data-table" aria-label="Tournament Championship Standings">
        <thead>
          <tr>
            <th scope="col" style={{ width: "60px" }}>Pos</th>
            <th
              scope="col"
              className={onSort ? "sortable" : ""}
              onClick={() => onSort && onSort("name")}
            >
              Team {sortKey === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th
              scope="col"
              className={onSort ? "sortable" : ""}
              onClick={() => onSort && onSort("sport")}
            >
              Sport {sortKey === "sport" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th scope="col">City</th>
            <th
              scope="col"
              className={onSort ? "sortable" : ""}
              onClick={() => onSort && onSort("points")}
              style={{ textAlign: "right" }}
            >
              PTS {sortKey === "points" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th scope="col" style={{ textAlign: "center" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((t, idx) => {
            const isLeader = idx === 0;
            return (
              <tr key={t._id || t.id || idx} className={isLeader ? "leader-row" : ""}>
                <td className={`rank-cell ${isLeader ? "top-rank" : ""}`}>
                  #{idx + 1}
                </td>
                <td>
                  <strong>{t.name}</strong>
                  {isLeader && (
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        fontSize: "0.75rem",
                        color: "var(--accent)",
                        fontWeight: 800,
                        fontStyle: "italic"
                      }}
                    >
                      ★ LEADER
                    </span>
                  )}
                </td>
                <td>
                  <span className="team-sport-pill">{t.sport}</span>
                </td>
                <td style={{ color: "var(--ink-muted)" }}>{t.city || "—"}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, fontStyle: "italic", color: "var(--primary)" }}>
                  {t.points || 0}
                </td>
                <td style={{ textAlign: "center" }}>
                  <StatusBadge status={t.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
