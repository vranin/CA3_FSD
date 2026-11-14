import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <nav className="bottom-tab-bar" aria-label="Mobile Navigation">
      <NavLink to="/" className={({ isActive }) => `tab-item ${isActive ? "active" : ""}`} end>
        <span className="tab-icon">⚡</span>
        <span>Live</span>
      </NavLink>
      <NavLink to="/teams" className={({ isActive }) => `tab-item ${isActive ? "active" : ""}`}>
        <span className="tab-icon">🛡️</span>
        <span>Teams</span>
      </NavLink>
      <NavLink to="/standings" className={({ isActive }) => `tab-item ${isActive ? "active" : ""}`}>
        <span className="tab-icon">🏆</span>
        <span>Standings</span>
      </NavLink>
      <NavLink to="/add" className={({ isActive }) => `tab-item ${isActive ? "active" : ""}`}>
        <span className="tab-icon">➕</span>
        <span>Enroll</span>
      </NavLink>
    </nav>
  );
}
