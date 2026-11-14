import { useState } from "react";
import { Link } from "react-router-dom";
import MatchCard from "../components/MatchCard.jsx";
import DataTable from "../components/DataTable.jsx";
import Button from "../components/ui/Button.jsx";

export default function Dashboard({ teams = [], loading = false }) {
  // One memorable moment: Interactive Live Match state
  const [liveMatch, setLiveMatch] = useState({
    id: "live-m1",
    sport: "Football",
    homeTeam: { name: "Thane Tigers", city: "Thane" },
    awayTeam: { name: "Mumbai Mavericks", city: "Mumbai" },
    homeScore: 2,
    awayScore: 1,
    status: "Live",
    minute: "74'",
    venue: "Metropolitan Sports Complex"
  });

  const handleLiveScore = (matchId, side) => {
    setLiveMatch(prev => ({
      ...prev,
      [side === "home" ? "homeScore" : "awayScore"]: prev[side === "home" ? "homeScore" : "awayScore"] + 1
    }));
  };

  const totalCount = teams.length;
  const liveCount = teams.filter(t => t.status === "Live").length;
  const completedCount = teams.filter(t => t.status === "Completed").length;

  // Top 3 in Standings
  const topThree = [...teams]
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 3);

  return (
    <div>
      {/* Hero Banner with Speed Stripe & Subtle Track Lane Pattern */}
      <section className="hero-banner">
        <div className="speed-stripe" aria-hidden="true" />
        <div className="container hero-content">
          <div className="hero-meta">
            <span className="hero-tag">Season 2026</span>
            <span className="hero-tag" style={{ background: "var(--signal-orange)" }}>
              ● Live Updates Active
            </span>
          </div>

          <div>
            <h1 className="hero-title">
              National Sports <em>Championship</em>
            </h1>
            <p className="hero-subtitle">
              Live tournament desk tracking real-time fixtures, rosters, and discipline standings.
            </p>
          </div>

          {/* Jersey-style Numeral Metric Counters */}
          <div className="metrics-strip" aria-label="Tournament Metrics">
            <div className="metric-item">
              <div className="metric-number">{totalCount}</div>
              <div className="metric-label">Enrolled Teams</div>
            </div>
            <div className="metric-item">
              <div className="metric-number live">{liveCount}</div>
              <div className="metric-label">Live Battles</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">{completedCount}</div>
              <div className="metric-label">Finalized</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ marginTop: "2rem" }}>
        {/* ONE MEMORABLE MOMENT: LIVE-MATCH SPOTLIGHT */}
        <section aria-label="Featured Live Encounter">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontStyle: "italic", textTransform: "uppercase" }}>
              ⚡ Featured Live Spotlight
            </h2>
            <span style={{ fontSize: "0.85rem", color: "var(--ink-muted)" }}>Auto-Sync Enabled</span>
          </div>
          <MatchCard match={liveMatch} isSpotlight={true} onUpdateScore={handleLiveScore} />
        </section>

        {/* TOP THREE PODIUM / STANDINGS */}
        <section style={{ marginTop: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.45rem", fontStyle: "italic", textTransform: "uppercase" }}>
                🏆 Current Leaders
              </h2>
              <p style={{ color: "var(--ink-muted)", fontSize: "0.88rem" }}>Top three squads ranked by cumulative points.</p>
            </div>
            <Link to="/standings" style={{ textDecoration: "none" }}>
              <Button variant="secondary" size="sm">
                Full Table &rarr;
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="skeleton" style={{ height: "140px", width: "100%" }} />
          ) : topThree.length > 0 ? (
            <DataTable teams={topThree} />
          ) : (
            <div className="empty-state">
              <p className="empty-state-text">No teams registered yet. Enroll teams to view standings.</p>
              <Link to="/add">
                <Button variant="primary">Enroll First Team</Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
