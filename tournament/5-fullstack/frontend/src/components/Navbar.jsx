import { NavLink } from "react-router-dom";

export default function Navbar({ teamsCount }) {
  return (
    <header className="app-header">
      <div>
        <h1>🏆 National Sports Championship</h1>
        <p>Continuous Assessment 3 — React Component Architecture (CO3)</p>
      </div>
      <nav className="navbar">
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Teams ({teamsCount})
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => (isActive ? "active" : "")}>
          ➕ Register Team
        </NavLink>
      </nav>
    </header>
  );
}
