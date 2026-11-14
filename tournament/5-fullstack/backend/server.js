require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Team = mongoose.model("Team", new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, trim: true },
  sport: { type: String, required: true },
  city: String,
  points: { type: Number, default: 0 },
  status: { type: String, enum: ["Scheduled", "Live", "Completed"], default: "Scheduled" }
}, { timestamps: true }));

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

const wrap = fn => (req, res, next) => fn(req, res, next).catch(next);
app.get("/api/teams", wrap(async (req, res) => res.json(await Team.find().sort("-createdAt"))));
app.post("/api/teams", wrap(async (req, res) => res.status(201).json(await Team.create(req.body))));
app.put("/api/teams/:id", wrap(async (req, res) => {
  const t = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  t ? res.json(t) : res.status(404).json({ error: "Team not found" });
}));
app.delete("/api/teams/:id", wrap(async (req, res) => {
  const t = await Team.findByIdAndDelete(req.params.id);
  t ? res.status(204).end() : res.status(404).json({ error: "Team not found" });
}));

app.use((err, req, res, next) => {
  const bad = err.name === "ValidationError" || err.name === "CastError";
  res.status(bad ? 422 : 500).json({ error: bad ? err.message : "Internal server error" });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log("Backend running")))
  .catch(e => { console.error("DB connection failed:", e.message); process.exit(1); });
