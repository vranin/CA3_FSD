import { NavLink } from "react-router-dom";

export default function Navbar({ theme, onToggleTheme }) {
  return (
    <header className="app-topbar">
      <div className="container topbar-content">
        <NavLink to="/" className="brand-link" aria-label="APEX Tournament Home">
          <span className="brand-badge">APEX</span>
          <span className="brand-title">
            CHAMPIONSHIP <span>2026</span>
          </span>
        </NavLink>

        <nav className="desktop-nav" aria-label="Main Navigation">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} end>
            Dashboard
          </NavLink>
          <NavLink to="/teams" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Teams
          </NavLink>
          <NavLink to="/standings" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Fixtures &amp; Standings
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            + Enroll Team
          </NavLink>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
