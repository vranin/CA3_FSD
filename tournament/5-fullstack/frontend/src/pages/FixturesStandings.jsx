import { useState } from "react";
import MatchCard from "../components/MatchCard.jsx";
import DataTable from "../components/DataTable.jsx";

export default function FixturesStandings({ teams = [], onScoreIncrement }) {
  const [activeTab, setActiveTab] = useState("all");

  // Sample Tournament Fixtures connected with real team names
  const [matches, setMatches] = useState([
    {
      id: "m-1",
      sport: "Football",
      homeTeam: { name: teams[0]?.name || "Thane Tigers", city: teams[0]?.city || "Thane" },
      awayTeam: { name: teams[1]?.name || "Mumbai Mavericks", city: teams[1]?.city || "Mumbai" },
      homeScore: 2,
      awayScore: 1,
      status: "Live",
      minute: "76'",
      venue: "Central Stadium"
    },
    {
      id: "m-2",
      sport: "Basketball",
      homeTeam: { name: teams[2]?.name || "Pune Panthers", city: teams[2]?.city || "Pune" },
      awayTeam: { name: teams[3]?.name || "Bengaluru Bulls", city: teams[3]?.city || "Bengaluru" },
      homeScore: 82,
      awayScore: 78,
      status: "Live",
      minute: "Q4 3:12",
      venue: "Metro Indoor Arena"
    },
    {
      id: "m-3",
      sport: "Cricket",
      homeTeam: { name: teams[4]?.name || "Delhi Dragons", city: teams[4]?.city || "Delhi" },
      awayTeam: { name: teams[5]?.name || "Chennai Champions", city: teams[5]?.city || "Chennai" },
      homeScore: 0,
      awayScore: 0,
      status: "Scheduled",
      minute: "Tomorrow 19:30",
      venue: "Grand Cricket Ground"
    }
  ]);

  const handleUpdateScore = (matchId, side) => {
    setMatches(prev =>
      prev.map(m => {
        if (m.id !== matchId) return m;
        const newHomeScore = side === "home" ? m.homeScore + 1 : m.homeScore;
        const newAwayScore = side === "away" ? m.awayScore + 1 : m.awayScore;

        // If score is updated, increment points in tournament standings for winning team
        if (onScoreIncrement) {
          const scoringTeam = side === "home" ? m.homeTeam.name : m.awayTeam.name;
          const matchTarget = teams.find(t => t.name === scoringTeam);
          if (matchTarget) {
            onScoreIncrement(matchTarget._id || matchTarget.id, (matchTarget.points || 0) + 1);
          }
        }

        return { ...m, homeScore: newHomeScore, awayScore: newAwayScore };
      })
    );
  };

  // Sorted teams for standings
  const sortedStandings = [...teams].sort((a, b) => (b.points || 0) - (a.points || 0));

  const filteredMatches = activeTab === "all"
    ? matches
    : matches.filter(m => m.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontStyle: "italic",
            textTransform: "uppercase"
          }}
        >
          Fixtures &amp; Standings
        </h1>
        <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem" }}>
          Track scheduled fixtures, enter live match scores, and review updated championship rankings.
        </p>
      </div>

      {/* Grid Layout: Fixtures on one side, Table on the other for wide screens */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2.5rem" }}>
        {/* Section 1: Fixtures */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.45rem",
                fontStyle: "italic",
                textTransform: "uppercase"
              }}
            >
              ⚽ Match Encounters
            </h2>
            <div className="chip-group">
              {["all", "Live", "Scheduled"].map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`filter-chip ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "all" ? "All Fixtures" : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="fixtures-grid">
            {filteredMatches.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                isSpotlight={false}
                onUpdateScore={handleUpdateScore}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Points Standings Table */}
        <section>
          <div style={{ marginBottom: "1rem" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.45rem",
                fontStyle: "italic",
                textTransform: "uppercase"
              }}
            >
              🏆 Championship Points Standings
            </h2>
            <p style={{ color: "var(--ink-muted)", fontSize: "0.88rem" }}>
              The #1 ranked squad holds qualification priority. Standings dynamically update on score entry.
            </p>
          </div>

          <DataTable teams={sortedStandings} />
        </section>
      </div>
    </div>
  );
}
