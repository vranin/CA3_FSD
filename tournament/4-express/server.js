const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
let teams = [{ id: 1, name: "Thane Tigers", sport: "Football", city: "Thane" }];
let nextId = 2;
const users = [];

app.use(express.json());
app.use((req, res, next) => {            // request logging middleware
  const t = Date.now();
  res.on("finish", () => console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - t}ms`));
  next();
});

const validateTeam = (req, res, next) => {   // input validation middleware
  const { name, sport } = req.body;
  if (typeof name !== "string" || name.trim().length < 3) return next({ status: 422, message: "name must be at least 3 characters" });
  if (typeof sport !== "string" || !sport.trim()) return next({ status: 422, message: "sport is required" });
  next();
};

const auth = (req, res, next) => {       // JWT protection
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  try { req.user = jwt.verify(token, SECRET); next(); }
  catch { next({ status: 401, message: "Missing or invalid token" }); }
};

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Express REST API Explorer</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0f172a;color:#f8fafc;max-width:960px;margin:2rem auto;padding:0 1.5rem}
    .header{border-bottom:1px solid #334155;padding-bottom:1rem;margin-bottom:1.5rem}
    h1{font-size:1.75rem;color:#38bdf8}
    .card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:1.25rem;margin-bottom:1.25rem}
    .card-title{font-size:1.1rem;font-weight:700;color:#94a3b8;margin-bottom:0.75rem}
    table{width:100%;border-collapse:collapse}
    th,td{padding:0.75rem;border-bottom:1px solid #334155;text-align:left;font-size:0.9rem}
    th{color:#94a3b8;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em}
    .badge{padding:0.2rem 0.5rem;border-radius:4px;font-size:0.75rem;font-weight:700;display:inline-block}
    .get{background:#0369a1;color:#e0f2fe}
    .post{background:#15803d;color:#dcfce7}
    .put{background:#b45309;color:#fef3c7}
    .delete{background:#b91c1c;color:#fee2e2}
    .lock{background:#475569;color:#f1f5f9;font-size:0.7rem;padding:0.15rem 0.4rem;border-radius:4px}
    pre{background:#020617;border:1px solid #1e293b;border-radius:6px;padding:1rem;overflow-x:auto;font-size:0.85rem;color:#a5f3fc}
  </style></head><body>
  <div class="header">
    <h1>🚀 Express.js REST API with JWT &amp; bcrypt (CO5)</h1>
    <p style="color:#94a3b8;margin-top:0.3rem">Tournament Management RESTful Service featuring custom logging, validation middleware, and JWT authentication</p>
  </div>
  <div class="card">
    <div class="card-title">📋 Registered REST Routes &amp; Middleware Chain</div>
    <table>
      <thead><tr><th>Method</th><th>Endpoint</th><th>Protection &amp; Middleware</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><span class="badge post">POST</span></td><td><code>/auth/register</code></td><td>Validation (6+ char pass)</td><td>Registers user with bcrypt password hash</td></tr>
        <tr><td><span class="badge post">POST</span></td><td><code>/auth/login</code></td><td>bcrypt.compare</td><td>Authenticates credentials &amp; issues signed JWT</td></tr>
        <tr><td><span class="badge get">GET</span></td><td><code>/api/teams</code></td><td>Public</td><td>Lists all enrolled championship teams</td></tr>
        <tr><td><span class="badge get">GET</span></td><td><code>/api/teams/:id</code></td><td>Public</td><td>Retrieves single team by identifier</td></tr>
        <tr><td><span class="badge post">POST</span></td><td><code>/api/teams</code></td><td><span class="lock">🔒 JWT auth</span> + validateTeam</td><td>Creates team record (Protected route)</td></tr>
        <tr><td><span class="badge put">PUT</span></td><td><code>/api/teams/:id</code></td><td><span class="lock">🔒 JWT auth</span> + validateTeam</td><td>Updates team record (Protected route)</td></tr>
        <tr><td><span class="badge delete">DELETE</span></td><td><code>/api/teams/:id</code></td><td><span class="lock">🔒 JWT auth</span></td><td>Removes team record (Protected route)</td></tr>
      </tbody>
    </table>
  </div>
  <div class="card">
    <div class="card-title">📊 Active In-Memory Teams Snapshot</div>
    <pre>${JSON.stringify(teams, null, 2)}</pre>
  </div>
  </body></html>`);
});

app.post("/auth/register", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) return next({ status: 422, message: "username and a 6+ char password required" });
  if (users.find(u => u.username === username)) return next({ status: 409, message: "username taken" });
  users.push({ username, hash: await bcrypt.hash(password, 10) });
  res.status(201).json({ message: "registered" });
});
app.post("/auth/login", async (req, res, next) => {
  const u = users.find(x => x.username === req.body.username);
  if (!u || !(await bcrypt.compare(req.body.password || "", u.hash))) return next({ status: 401, message: "Invalid credentials" });
  res.json({ token: jwt.sign({ username: u.username }, SECRET, { expiresIn: "1h" }) });
});

// CRUD
app.get("/api/teams", (req, res) => res.json(teams));
app.get("/api/teams/:id", (req, res, next) => {
  const t = teams.find(x => x.id === +req.params.id);
  t ? res.json(t) : next({ status: 404, message: "Team not found" });
});
app.post("/api/teams", auth, validateTeam, (req, res) => {          // protected
  const t = { id: nextId++, name: req.body.name, sport: req.body.sport, city: req.body.city || "" };
  teams.push(t); res.status(201).json(t);
});
app.put("/api/teams/:id", auth, validateTeam, (req, res, next) => {
  const i = teams.findIndex(x => x.id === +req.params.id);
  if (i < 0) return next({ status: 404, message: "Team not found" });
  teams[i] = { ...teams[i], ...req.body, id: teams[i].id }; res.json(teams[i]);
});
app.delete("/api/teams/:id", auth, (req, res, next) => {
  const n = teams.length;
  teams = teams.filter(x => x.id !== +req.params.id);
  teams.length < n ? res.status(204).end() : next({ status: 404, message: "Team not found" });
});

app.use((req, res, next) => next({ status: 404, message: "Route not found" }));
app.use((err, req, res, next) => {                                   // centralized error handler
  if (err.type === "entity.parse.failed") err = { status: 400, message: "Invalid JSON body" };
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});
app.listen(process.env.PORT || 4000, () => console.log("API on :4000"));
