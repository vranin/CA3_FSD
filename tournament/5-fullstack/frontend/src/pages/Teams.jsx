import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import TeamCard from "../components/TeamCard.jsx";
import Modal from "../components/ui/Modal.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";

export default function Teams({
  teams = [],
  loading = false,
  onUpdateTeam,
  onDeleteTeam,
  onStatusChange,
  onScoreIncrement
}) {
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("points-desc");

  // Edit Modal State
  const [editingTeam, setEditingTeam] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", sport: "Football", city: "", points: 0, status: "Scheduled" });
  const [editErrors, setEditErrors] = useState({});
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // Delete Confirm Modal State
  const [deletingTeam, setDeletingTeam] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Available sports derived from teams + presets
  const sportsList = useMemo(() => {
    const set = new Set(["Football", "Cricket", "Basketball", "Kabaddi"]);
    teams.forEach(t => { if (t.sport) set.add(t.sport); });
    return Array.from(set);
  }, [teams]);

  // Filter and sort teams
  const filteredTeams = useMemo(() => {
    return teams.filter(t => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || t.name.toLowerCase().includes(q) || (t.city && t.city.toLowerCase().includes(q));
      const matchesSport = selectedSport === "all" || t.sport === selectedSport;
      const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;
      return matchesSearch && matchesSport && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === "points-desc") return (b.points || 0) - (a.points || 0);
      if (sortBy === "points-asc") return (a.points || 0) - (b.points || 0);
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "status-asc") return (a.status || "").localeCompare(b.status || "");
      return 0;
    });
  }, [teams, search, selectedSport, selectedStatus, sortBy]);

  // Handle Edit initiation
  const handleOpenEdit = (team) => {
    setEditingTeam(team);
    setEditForm({
      name: team.name,
      sport: team.sport,
      city: team.city || "",
      points: team.points || 0,
      status: team.status || "Scheduled"
    });
    setEditErrors({});
  };

  const handleSaveEdit = async () => {
    const errs = {};
    if (!editForm.name || editForm.name.trim().length < 3) {
      errs.name = "Team name requires at least 3 characters.";
    }
    if (!editForm.sport) errs.sport = "Please specify a sport.";
    if (editForm.city && !/^[A-Za-z\s.-]{2,}$/.test(editForm.city.trim())) {
      errs.city = "City must use letters only (min 2 characters).";
    }

    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsEditSubmitting(true);
    try {
      const id = editingTeam._id || editingTeam.id;
      await onUpdateTeam(id, editForm);
      setEditingTeam(null);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingTeam) return;
    setIsDeleting(true);
    try {
      const id = deletingTeam._id || deletingTeam.id;
      await onDeleteTeam(id);
      setDeletingTeam(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontStyle: "italic", textTransform: "uppercase" }}>
            Championship Rosters
          </h1>
          <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem" }}>
            Showing {filteredTeams.length} of {teams.length} enrolled squads.
          </p>
        </div>
        <Link to="/add">
          <Button variant="accent">+ Enroll New Team</Button>
        </Link>
      </div>

      {/* Filter and Search Bar with Chips */}
      <div className="filter-bar">
        <div className="search-wrap">
          <Input
            id="team-search"
            name="search"
            type="search"
            placeholder="🔍 Search squad name or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Sport Filter Chips */}
          <div className="chip-group" role="radiogroup" aria-label="Filter by sport">
            <button
              type="button"
              className={`filter-chip ${selectedSport === "all" ? "active" : ""}`}
              onClick={() => setSelectedSport("all")}
            >
              All Sports
            </button>
            {sportsList.map(s => (
              <button
                key={s}
                type="button"
                className={`filter-chip ${selectedSport === s ? "active" : ""}`}
                onClick={() => setSelectedSport(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Status Filter Chips */}
          <div className="chip-group" role="radiogroup" aria-label="Filter by status">
            {["all", "Live", "Scheduled", "Completed"].map(statusVal => (
              <button
                key={statusVal}
                type="button"
                className={`filter-chip ${selectedStatus === statusVal ? "active" : ""}`}
                onClick={() => setSelectedStatus(statusVal)}
              >
                {statusVal === "all" ? "All Status" : statusVal}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={{ minWidth: "180px" }}>
            <Select
              id="sort-select"
              name="sortBy"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              options={[
                { value: "points-desc", label: "Points (Highest)" },
                { value: "points-asc", label: "Points (Lowest)" },
                { value: "name-asc", label: "Team Name (A-Z)" },
                { value: "status-asc", label: "Status" }
              ]}
              style={{ marginBottom: 0 }}
            />
          </div>
        </div>
      </div>

      {/* Content Rendering: Skeletons, Empty State, or Grid */}
      {loading ? (
        <div className="teams-grid">
          {[1, 2, 3, 4, 5, 6].map(k => (
            <div key={k} className="skeleton" style={{ height: "180px" }} />
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>🛡️</span>
          <h3 className="empty-state-title">No Squads Matched Your Filter</h3>
          <p className="empty-state-text">
            We couldn't find any team matching "{search}". Clear your filters or enroll a new team.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setSelectedSport("all");
                setSelectedStatus("all");
              }}
            >
              Reset Filters
            </Button>
            <Link to="/add">
              <Button variant="primary">+ Enroll New Team</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="teams-grid">
          {filteredTeams.map(team => (
            <TeamCard
              key={team._id || team.id}
              team={team}
              onEdit={handleOpenEdit}
              onDelete={setDeletingTeam}
              onStatusChange={onStatusChange}
              onScoreIncrement={onScoreIncrement}
            />
          ))}
        </div>
      )}

      {/* Edit Team Modal */}
      <Modal
        isOpen={Boolean(editingTeam)}
        onClose={() => setEditingTeam(null)}
        title="Edit Championship Squad"
        onConfirm={handleSaveEdit}
        confirmText="Save Changes"
        confirmLoading={isEditSubmitting}
      >
        <Input
          id="edit-name"
          name="name"
          label="Team Name"
          value={editForm.name}
          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
          error={editErrors.name}
          hint="Must be at least 3 characters"
          required
        />
        <Select
          id="edit-sport"
          name="sport"
          label="Sport Discipline"
          value={editForm.sport}
          onChange={e => setEditForm({ ...editForm, sport: e.target.value })}
          options={["Football", "Cricket", "Basketball", "Kabaddi", "Badminton"]}
          error={editErrors.sport}
          required
        />
        <Input
          id="edit-city"
          name="city"
          label="City / Region"
          value={editForm.city}
          onChange={e => setEditForm({ ...editForm, city: e.target.value })}
          error={editErrors.city}
          hint="Letters only"
        />
        <Input
          id="edit-points"
          name="points"
          type="number"
          label="Cumulative Points"
          value={editForm.points}
          onChange={e => setEditForm({ ...editForm, points: Number(e.target.value) })}
        />
        <Select
          id="edit-status"
          name="status"
          label="Tournament Status"
          value={editForm.status}
          onChange={e => setEditForm({ ...editForm, status: e.target.value })}
          options={["Scheduled", "Live", "Completed"]}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingTeam)}
        onClose={() => setDeletingTeam(null)}
        title="Confirm Removal"
        onConfirm={handleConfirmDelete}
        confirmText="Delete Team"
        confirmVariant="danger"
        confirmLoading={isDeleting}
      >
        <p style={{ fontSize: "0.95rem", color: "var(--ink)" }}>
          Are you sure you want to remove <strong>{deletingTeam?.name}</strong> from the tournament roster? This action cannot be reversed.
        </p>
      </Modal>
    </div>
  );
}
