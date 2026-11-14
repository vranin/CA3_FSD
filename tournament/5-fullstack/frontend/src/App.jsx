import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Toast from "./components/ui/Toast.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Teams from "./pages/Teams.jsx";
import TeamFormPage from "./pages/TeamFormPage.jsx";
import FixturesStandings from "./pages/FixturesStandings.jsx";
import NotFound from "./pages/NotFound.jsx";

// Sanitize and normalize API URL to eliminate double-slashes or path mismatches
function getBaseApiUrl() {
  const raw = import.meta.env.VITE_API_URL;
  if (!raw || typeof raw !== "string") return "";
  let clean = raw.trim();
  clean = clean.replace(/\/+$/, "");
  clean = clean.replace(/\/api\/teams$/, "").replace(/\/api$/, "");
  return clean;
}

const API = getBaseApiUrl();

export default function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Dark / Light Mode state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("apex_theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("apex_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Initial Fetch: async/await with error handling & VITE_API_URL fallback
  const loadTeams = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = API ? `${API}/api/teams` : "/teams.json";
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(`Could not load rosters: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  // CREATE: POST /api/teams
  const handleAddTeam = async (teamData) => {
    try {
      if (API) {
        const res = await fetch(`${API}/api/teams`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teamData)
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error || `HTTP ${res.status}`);
        }
        const created = await res.json();
        setTeams(prev => [created, ...prev]);
      } else {
        const mockCreated = { ...teamData, id: Date.now() };
        setTeams(prev => [mockCreated, ...prev]);
      }
      showToast(`Successfully enrolled "${teamData.name}" into tournament!`, "success");
    } catch (err) {
      showToast(`Failed to enroll team: ${err.message}`, "error");
      throw err;
    }
  };

  // UPDATE: PUT /api/teams/:id
  const handleUpdateTeam = async (id, updatedFields) => {
    try {
      if (API) {
        const res = await fetch(`${API}/api/teams/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields)
        });
        if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
        const saved = await res.json();
        setTeams(prev => prev.map(t => ((t._id || t.id) === id ? saved : t)));
      } else {
        setTeams(prev =>
          prev.map(t => ((t._id || t.id) === id ? { ...t, ...updatedFields } : t))
        );
      }
      showToast("Team record updated successfully", "success");
    } catch (err) {
      showToast(`Update failed: ${err.message}`, "error");
    }
  };

  // DELETE: DELETE /api/teams/:id
  const handleDeleteTeam = async (id) => {
    try {
      if (API) {
        const res = await fetch(`${API}/api/teams/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      }
      setTeams(prev => prev.filter(t => (t._id || t.id) !== id));
      showToast("Team removed from championship roster", "success");
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, "error");
    }
  };

  // Quick Status Toggle
  const handleStatusChange = async (id, nextStatus) => {
    await handleUpdateTeam(id, { status: nextStatus });
  };

  // Quick Score / Points Increment
  const handleScoreIncrement = async (id, newPoints) => {
    await handleUpdateTeam(id, { points: newPoints });
  };

  return (
    <ErrorBoundary>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main className="content-area">
        <Routes>
          <Route
            path="/"
            element={<Dashboard teams={teams} loading={loading} />}
          />
          <Route
            path="/teams"
            element={
              <Teams
                teams={teams}
                loading={loading}
                onUpdateTeam={handleUpdateTeam}
                onDeleteTeam={handleDeleteTeam}
                onStatusChange={handleStatusChange}
                onScoreIncrement={handleScoreIncrement}
              />
            }
          />
          <Route
            path="/standings"
            element={
              <FixturesStandings
                teams={teams}
                onScoreIncrement={handleScoreIncrement}
              />
            }
          />
          <Route
            path="/add"
            element={
              <TeamFormPage
                onAddTeam={handleAddTeam}
                existingTeams={teams}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Mobile Tab Navigation */}
      <BottomNav />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </ErrorBoundary>
  );
}
