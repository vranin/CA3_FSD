import { useNavigate, Link } from "react-router-dom";
import { useForm } from "../hooks/useForm.js";
import Input from "../components/ui/Input.jsx";
import Select from "../components/ui/Select.jsx";
import Button from "../components/ui/Button.jsx";

export default function TeamFormPage({ onAddTeam, existingTeams = [] }) {
  const navigate = useNavigate();

  const validate = (formValues) => {
    const errs = {};
    const name = (formValues.name || "").trim();
    const city = (formValues.city || "").trim();

    if (!name) {
      errs.name = "Team name is required. Please enter at least 3 characters.";
    } else if (name.length < 3) {
      errs.name = "Team name must be at least 3 characters long.";
    } else if (
      existingTeams.some(
        t => t.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      errs.name = "This team name is already taken. Please choose a distinct name.";
    }

    if (!formValues.sport) {
      errs.sport = "Sport discipline is required. Please select an option from the list.";
    }

    if (!city) {
      errs.city = "City headquarters is required. Enter your representing city.";
    } else if (!/^[A-Za-z\s.-]{2,}$/.test(city)) {
      errs.city = "City should contain letters, spaces, or hyphens only (minimum 2 characters).";
    }

    if (formValues.points < 0) {
      errs.points = "Points cannot be negative.";
    }

    return errs;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm({
    initialValues: {
      name: "",
      sport: "Football",
      city: "",
      points: 0,
      status: "Scheduled"
    },
    validate,
    onSubmit: async (formValues) => {
      await onAddTeam(formValues);
      navigate("/teams");
    }
  });

  return (
    <div className="container" style={{ marginTop: "2rem", maxWidth: "680px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          to="/teams"
          style={{
            textDecoration: "none",
            color: "var(--ink-muted)",
            fontSize: "0.85rem",
            fontWeight: 600
          }}
        >
          &larr; Back to Championship Rosters
        </Link>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontStyle: "italic",
            textTransform: "uppercase",
            marginTop: "0.5rem"
          }}
        >
          Enroll Championship Squad
        </h1>
        <p style={{ color: "var(--ink-muted)", fontSize: "0.95rem" }}>
          Register a new team into the official championship tournament registry.
        </p>
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-sm)",
          padding: "2rem"
        }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <Input
            id="team-name-input"
            name="name"
            label="Squad Name"
            placeholder="e.g. Hyderabad Hawks"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : undefined}
            hint="Official club or franchise title (min 3 chars)"
            required
          />

          <Select
            id="team-sport-select"
            name="sport"
            label="Sport Discipline"
            value={values.sport}
            onChange={handleChange}
            onBlur={handleBlur}
            options={[
              { value: "Football", label: "Football (Soccer)" },
              { value: "Cricket", label: "Cricket" },
              { value: "Basketball", label: "Basketball" },
              { value: "Kabaddi", label: "Kabaddi" },
              { value: "Badminton", label: "Badminton" }
            ]}
            error={touched.sport ? errors.sport : undefined}
            required
          />

          <Input
            id="team-city-input"
            name="city"
            label="City / Headquarters"
            placeholder="e.g. Hyderabad"
            value={values.city}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.city ? errors.city : undefined}
            hint="Home city representing the franchise"
            required
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Input
              id="team-points-input"
              name="points"
              type="number"
              label="Starting Points"
              value={values.points}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.points ? errors.points : undefined}
              hint="Initial standings score (default 0)"
            />

            <Select
              id="team-status-select"
              name="status"
              label="Initial Status"
              value={values.status}
              onChange={handleChange}
              onBlur={handleBlur}
              options={["Scheduled", "Live", "Completed"]}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              loading={isSubmitting}
              style={{ flex: 1 }}
            >
              Enroll Squad
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/teams")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
