import React from "react";
import Button from "./ui/Button.jsx";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              padding: "2.5rem",
              borderRadius: "var(--radius-sm)",
              maxWidth: "540px",
              margin: "0 auto"
            }}
          >
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>⚡</span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.85rem",
                fontStyle: "italic",
                textTransform: "uppercase",
                marginBottom: "0.5rem"
              }}
            >
              Something went off-track
            </h2>
            <p style={{ color: "var(--ink-muted)", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
              The application encountered an unexpected hiccup. You can return to the dashboard to refresh the live scores.
            </p>
            {this.state.error?.message && (
              <pre
                style={{
                  background: "var(--surface-subtle)",
                  border: "1px solid var(--line)",
                  padding: "0.75rem",
                  fontSize: "0.8rem",
                  marginBottom: "1.5rem",
                  textAlign: "left",
                  overflowX: "auto"
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <Button variant="primary" onClick={this.handleReset}>
              Return to Tournament Desk
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
