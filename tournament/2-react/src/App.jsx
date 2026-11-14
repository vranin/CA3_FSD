import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import StatsHeader from "./components/StatsHeader.jsx";
import TeamList from "./components/TeamList.jsx";
import TeamForm from "./components/TeamForm.jsx";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState({ text: "", type: "success" });

  function showBanner(text, type = "success") {
    setBanner({ text, type });
    if (type === "success") {
      setTimeout(() => setBanner({ text: "", type: "success" }), 4000);
    }
  }

  useEffect(() => {
    fetch(API ? `${API}/api/teams` : "/teams.json")
      .then(r => {
        if (!r.ok) throw new Error(`HTTP Error ${r.status}`);
        return r.json();
      })
      .then(data => {
        setTeams(data);
        showBanner("Retrieved tournament records successfully", "success");
      })
      .catch(e => showBanner("Could not load tournament records: " + e.message, "err"))
      .finally(() => setLoading(false));
  }, []);

  async function addTeam(team) {
    try {
      if (API) {
        const res = await fetch(`${API}/api/teams`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(team)
        });
        if (!res.ok) throw new Error((await res.json()).error || res.statusText);
        const saved = await res.json();
        setTeams(prev => [saved, ...prev]);
      } else {
        const saved = { ...team, id: Date.now() };
        setTeams(prev => [saved, ...prev]);
      }
      showBanner(`Enrolled "${team.name}" into championship`, "success");
    } catch (e) {
      showBanner("Could not save team: " + e.message, "err");
    }
  }

  async function removeTeam(id) {
    try {
      if (API) {
        await fetch(`${API}/api/teams/${id}`, { method: "DELETE" });
      }
      setTeams(prev => prev.filter(t => (t._id || t.id) !== id));
      showBanner("Team removed from tournament", "success");
    } catch (e) {
      showBanner("Could not remove team: " + e.message, "err");
    }
  }

  function updateStatus(id, newStatus) {
    setTeams(prev =>
      prev.map(t => ((t._id || t.id) === id ? { ...t, status: newStatus } : t))
    );
    showBanner(`Status updated to "${newStatus}"`, "success");
  }

  function updatePoints(id, newPoints) {
    setTeams(prev =>
      prev.map(t => ((t._id || t.id) === id ? { ...t, points: newPoints } : t))
    );
  }

  return (
    <>
      <Navbar teamsCount={teams.length} />
      <StatsHeader teams={teams} />

      {banner.text && (
        <div className={`banner ${banner.type}`} role="alert">
          {banner.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>Loading tournament data…</div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <TeamList
                teams={teams}
                onDelete={removeTeam}
                onStatusChange={updateStatus}
                onPointsChange={updatePoints}
              />
            }
          />
          <Route
            path="/add"
            element={<TeamForm onSubmit={addTeam} existingTeams={teams} />}
          />
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <h2>404 — Page Not Found</h2>
              </div>
            }
          />
        </Routes>
      )}
    </>
  );
}
