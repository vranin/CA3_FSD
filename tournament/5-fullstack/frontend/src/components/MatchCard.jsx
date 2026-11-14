import StatusBadge from "./ui/StatusBadge.jsx";
import Button from "./ui/Button.jsx";

export default function MatchCard({
  match,
  isSpotlight = false,
  onUpdateScore
}) {
  const {
    id,
    sport = "Football",
    homeTeam = { name: "Home Squad" },
    awayTeam = { name: "Away Squad" },
    homeScore = 0,
    awayScore = 0,
    status = "Live",
    minute = "76'",
    venue = "National Sports Arena"
  } = match;

  const isLive = status === "Live";
  const homeWinning = isLive && homeScore > awayScore;
  const awayWinning = isLive && awayScore > homeScore;

  const sportIcons = {
    Football: "⚽",
    Cricket: "🏏",
    Basketball: "🏀",
    Kabaddi: "🤼",
    Badminton: "🏸"
  };
  const icon = sportIcons[sport] || "🏆";

  // ONE MEMORABLE MOMENT: Broadcast-Style Spotlight Card on Dashboard
  if (isSpotlight) {
    return (
      <div className="spotlight-card">
        {/* Spotlight Header */}
        <div className="spotlight-header">
          <div className="spotlight-meta">
            <span className="spotlight-icon">{icon}</span>
            <span className="spotlight-sport">{sport.toUpperCase()} CHAMPIONSHIP</span>
            <span className="spotlight-time">⏱ {minute}</span>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Center Scoreboard */}
        <div className="spotlight-scoreboard">
          {/* Home Team */}
          <div className="spotlight-team home">
            <div className="spotlight-team-crest">{homeTeam.name ? homeTeam.name.charAt(0) : "H"}</div>
            <div className="spotlight-team-details">
              <span className="spotlight-team-name">{homeTeam.name}</span>
              {homeTeam.city && <span className="spotlight-team-city">📍 {homeTeam.city}</span>}
            </div>
          </div>

          {/* Jersey Digit Scorebox */}
          <div className="spotlight-score-box" aria-label={`Score ${homeScore} to ${awayScore}`}>
            <span className="spotlight-digit">{homeScore}</span>
            <span className="spotlight-colon">:</span>
            <span className="spotlight-digit">{awayScore}</span>
          </div>

          {/* Away Team */}
          <div className="spotlight-team away">
            <div className="spotlight-team-details text-right">
              <span className="spotlight-team-name">{awayTeam.name}</span>
              {awayTeam.city && <span className="spotlight-team-city">📍 {awayTeam.city}</span>}
            </div>
            <div className="spotlight-team-crest">{awayTeam.name ? awayTeam.name.charAt(0) : "A"}</div>
          </div>
        </div>

        {/* Spotlight Footer */}
        <div className="spotlight-footer">
          <span className="spotlight-venue">🏟️ {venue}</span>
          {onUpdateScore && isLive && (
            <div className="spotlight-actions">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onUpdateScore(id, "home")}
                aria-label={`Add goal for ${homeTeam.name}`}
              >
                +1 {homeTeam.name.split(" ")[0]}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onUpdateScore(id, "away")}
                aria-label={`Add goal for ${awayTeam.name}`}
              >
                +1 {awayTeam.name.split(" ")[0]}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // STANDARD FIXTURE CARD (Two-Row Stacked Sofascore Layout for Multi-card grids)
  return (
    <div className={`sports-fixture-card ${isLive ? "is-live" : ""}`}>
      {/* Top Meta Bar */}
      <div className="fixture-top-bar">
        <div className="fixture-sport-meta">
          <span className="fixture-icon">{icon}</span>
          <span className="fixture-sport-name">{sport.toUpperCase()}</span>
          {isLive ? (
            <span className="fixture-live-time">⏱ {minute}</span>
          ) : (
            <span className="fixture-sched-time">📅 {minute}</span>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Two-Row Stacking Scoreboard */}
      <div className="fixture-teams-list">
        {/* Home Team Row */}
        <div className={`fixture-team-row ${homeWinning ? "is-leading" : ""}`}>
          <div className="fixture-team-info">
            <span className="fixture-team-bullet" aria-hidden="true" />
            <span className="fixture-team-name">{homeTeam.name}</span>
            {homeTeam.city && <span className="fixture-team-city">({homeTeam.city})</span>}
          </div>
          <div className={`fixture-team-score ${homeWinning ? "score-leading" : ""}`}>
            {status === "Scheduled" ? "—" : homeScore}
          </div>
        </div>

        {/* Away Team Row */}
        <div className={`fixture-team-row ${awayWinning ? "is-leading" : ""}`}>
          <div className="fixture-team-info">
            <span className="fixture-team-bullet" aria-hidden="true" />
            <span className="fixture-team-name">{awayTeam.name}</span>
            {awayTeam.city && <span className="fixture-team-city">({awayTeam.city})</span>}
          </div>
          <div className={`fixture-team-score ${awayWinning ? "score-leading" : ""}`}>
            {status === "Scheduled" ? "—" : awayScore}
          </div>
        </div>
      </div>

      {/* Card Footer: Venue & Action Buttons */}
      <div className="fixture-bottom-bar">
        <span className="fixture-venue">📍 {venue}</span>
        {onUpdateScore && isLive && (
          <div className="fixture-quick-btns">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onUpdateScore(id, "home")}
              aria-label={`Add goal for ${homeTeam.name}`}
            >
              +1 {homeTeam.name.split(" ")[0]}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onUpdateScore(id, "away")}
              aria-label={`Add goal for ${awayTeam.name}`}
            >
              +1 {awayTeam.name.split(" ")[0]}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
