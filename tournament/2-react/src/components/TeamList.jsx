import { useState } from "react";
import TeamCard from "./TeamCard.jsx";

export default function TeamList({ teams, onDelete, onStatusChange, onPointsChange }) {
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("points-desc");

  const filtered = teams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || (t.city && t.city.toLowerCase().includes(search.toLowerCase()));
    const matchesSport = sport === "all" || t.sport === sport;
    const matchesStatus = status === "all" || t.status === status;
    return matchesSearch && matchesSport && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === "points-desc") return (b.points || 0) - (a.points || 0);
    if (sortBy === "points-asc") return (a.points || 0) - (b.points || 0);
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "status-asc") return a.status.localeCompare(b.status);
    return 0;
  });

  return (
    <div>
      <div className="controls-bar">
        <div className="filters">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search teams or cities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={sport} onChange={e => setSport(e.target.value)}>
            <option value="all">All Sports</option>
            <option value="Football">Football</option>
            <option value="Cricket">Cricket</option>
            <option value="Basketball">Basketball</option>
            <option value="Kabaddi">Kabaddi</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Live">Live</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--muted)", marginRight: "0.4rem" }}>
            Sort by
          </label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="points-desc">Points (Highest First)</option>
            <option value="points-asc">Points (Lowest First)</option>
            <option value="name-asc">Team Name (A-Z)</option>
            <option value="status-asc">Status</option>
          </select>
        </div>
      </div>

      {!filtered.length ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "10px", border: "1px solid var(--line)" }}>
          <h3>No teams matched your criteria</h3>
          <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map(t => (
            <TeamCard
              key={t._id || t.id}
              team={t}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onPointsChange={onPointsChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
