import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "5rem 1rem", textAlign: "center" }}>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-sm)",
          padding: "3rem 1.5rem",
          maxWidth: "520px",
          margin: "0 auto"
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "5.5rem",
            fontWeight: 900,
            fontStyle: "italic",
            lineHeight: 0.9,
            color: "var(--accent)",
            marginBottom: "1rem"
          }}
        >
          404
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.75rem",
            fontStyle: "italic",
            textTransform: "uppercase",
            marginBottom: "0.75rem"
          }}
        >
          Out of Bounds
        </h1>
        <p
          style={{
            color: "var(--ink-muted)",
            fontSize: "0.95rem",
            marginBottom: "1.75rem",
            lineHeight: 1.5
          }}
        >
          The page or fixture you were looking for doesn't exist or may have been relocated. Return to the main tournament desk to catch up on live matches.
        </p>
        <Link to="/">
          <Button variant="primary">Return to Championship Desk</Button>
        </Link>
      </div>
    </div>
  );
}
