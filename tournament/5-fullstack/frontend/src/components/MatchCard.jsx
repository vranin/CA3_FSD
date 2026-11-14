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
    homeTeam,
    awayTeam,
    homeScore = 0,
    awayScore = 0,
    status = "Live",
    minute = "68'",
    venue = "National Arena"
  } = match;

  return (
    <div className={isSpotlight ? "live-match-spotlight" : "team-card"}>
      <div className="live-header">
        <div className="live-title-wrap">
          <StatusBadge status={status} />
          <span className="live-title">{sport} Championship</span>
        </div>
        <span className="match-venue">
          {status === "Live" ? `⏱ ${minute} • ${venue}` : venue}
        </span>
      </div>

      <div className="scoreboard">
        <div className="scoreboard-team home">
          <span className="scoreboard-team-name">{homeTeam.name}</span>
          <span className="scoreboard-team-city">📍 {homeTeam.city || "Home"}</span>
        </div>

        <div className="score-box" aria-label={`Score: ${homeScore} to ${awayScore}`}>
          <span className="score-digit">{homeScore}</span>
          <span className="score-divider">:</span>
          <span className="score-digit">{awayScore}</span>
        </div>

        <div className="scoreboard-team away">
          <span className="scoreboard-team-name">{awayTeam.name}</span>
          <span className="scoreboard-team-city">📍 {awayTeam.city || "Away"}</span>
        </div>
      </div>

      {isSpotlight && onUpdateScore && (
        <div className="live-footer">
          <span>Real-time Court Feed</span>
          <div className="score-action-btns">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onUpdateScore(id, "home")}
              aria-label={`Add goal for ${homeTeam.name}`}
            >
              + {homeTeam.name} Goal
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onUpdateScore(id, "away")}
              aria-label={`Add goal for ${awayTeam.name}`}
            >
              + {awayTeam.name} Goal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
