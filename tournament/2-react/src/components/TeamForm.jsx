import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TeamForm({ onSubmit, existingTeams = [] }) {
  const [form, setForm] = useState({ name: "", sport: "Football", city: "", status: "Scheduled", points: 0 });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const change = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "points" ? Number(value) : value }));
  };

  function validate() {
    const err = {};
    if (form.name.trim().length < 3) err.name = "Team name must be at least 3 characters.";
    else if (existingTeams.some(t => t.name.toLowerCase() === form.name.trim().toLowerCase())) {
      err.name = "A team with this name is already registered.";
    }
    if (!form.sport.trim()) err.sport = "Please specify a sport.";
    if (!form.city.trim() || !/^[A-Za-z\s.-]{2,}$/.test(form.city.trim())) {
      err.city = "City must be at least 2 characters (letters only).";
    }
    return err;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (!Object.keys(validationErrors).length) {
      onSubmit(form);
      navigate("/");
    }
  }

  return (
    <div className="form-card">
      <h2 className="form-title">➕ Register Championship Team</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Team Name</label>
          <input
            id="name"
            name="name"
            placeholder="e.g. Hyderabad Hawks"
            value={form.name}
            onChange={change}
          />
          <span className="err-msg">{errors.name}</span>
        </div>

        <div className="form-group">
          <label htmlFor="sport">Sport Discipline</label>
          <select id="sport" name="sport" value={form.sport} onChange={change}>
            <option value="Football">Football</option>
            <option value="Cricket">Cricket</option>
            <option value="Basketball">Basketball</option>
            <option value="Kabaddi">Kabaddi</option>
            <option value="Badminton">Badminton</option>
          </select>
          <span className="err-msg">{errors.sport}</span>
        </div>

        <div className="form-group">
          <label htmlFor="city">City Headquarters</label>
          <input
            id="city"
            name="city"
            placeholder="e.g. Hyderabad"
            value={form.city}
            onChange={change}
          />
          <span className="err-msg">{errors.city}</span>
        </div>

        <div className="form-group">
          <label htmlFor="status">Initial Tournament Status</label>
          <select id="status" name="status" value={form.status} onChange={change}>
            <option value="Scheduled">Scheduled</option>
            <option value="Live">Live</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" style={{ flex: 1 }}>
            Save &amp; Enroll Team
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
