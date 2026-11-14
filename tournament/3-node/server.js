const http = require("http");
const fs = require("fs");
const path = require("path");
const store = require("./store");

// Notification Stream: events appended to data/events.log via Writable Stream
const logPath = path.join(__dirname, "data", "events.log");
const logStream = fs.createWriteStream(logPath, { flags: "a" });

store.on("team:added", t => {
  const line = `[${new Date().toISOString()}] EVENT: team:added -> "${t.name}" (${t.sport}, ${t.city})\n`;
  logStream.write(line);
  console.log("⚡ [EventEmitter]", line.trim());
});

store.on("team:updated", t => {
  const line = `[${new Date().toISOString()}] EVENT: team:updated -> "${t.name}" status: ${t.status}, points: ${t.points}\n`;
  logStream.write(line);
  console.log("⚡ [EventEmitter]", line.trim());
});

store.on("team:deleted", t => {
  const line = `[${new Date().toISOString()}] EVENT: team:deleted -> "${t.name}" (ID ${t.id})\n`;
  logStream.write(line);
  console.log("⚡ [EventEmitter]", line.trim());
});

function send(res, code, data, contentType = "application/json") {
  res.writeHead(code, {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(contentType === "application/json" ? JSON.stringify(data, null, 2) : data);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 1e6) req.destroy();
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  if (req.method === "OPTIONS") return send(res, 204, "");

  const urlParts = req.url.split("/").filter(Boolean);

  try {
    // GET / -> Live Node.js Server Dashboard
    if (req.method === "GET" && req.url === "/") {
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Node.js Server Utility</title>
      <style>
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#0f172a;color:#f8fafc;max-width:900px;margin:2rem auto;padding:0 1.5rem}
        .header{border-bottom:1px solid #334155;padding-bottom:1rem;margin-bottom:1.5rem}
        h1{font-size:1.75rem;color:#38bdf8}
        .badge{background:#0284c7;color:#fff;padding:0.25rem 0.6rem;border-radius:4px;font-size:0.8rem;font-weight:700}
        .card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:1.25rem;margin-bottom:1.25rem}
        .card-title{font-size:1.1rem;font-weight:700;color:#94a3b8;margin-bottom:0.75rem}
        pre{background:#020617;border:1px solid #1e293b;border-radius:6px;padding:1rem;overflow-x:auto;font-size:0.88rem;color:#a5f3fc}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        code{color:#f43f5e}
      </style></head><body>
      <div class="header">
        <h1>⚡ Node.js Native HTTP Server Utility (CO4)</h1>
        <p style="color:#94a3b8;margin-top:0.3rem">Zero-dependency server using built-in <code>http</code>, <code>fs/promises</code>, <code>path</code>, <code>events.EventEmitter</code>, and <code>Streams</code></p>
      </div>
      <div class="grid">
        <div class="card">
          <div class="card-title">📡 Endpoints Exposed</div>
          <p>• <code>GET /teams</code> - Fetch all teams via fs.readFile</p>
          <p>• <code>POST /teams</code> - Append team &amp; emit EventEmitter</p>
          <p>• <code>PUT /teams/:id</code> - Update team record</p>
          <p>• <code>DELETE /teams/:id</code> - Remove record</p>
          <p>• <code>GET /events</code> - Stream events.log via ReadStream</p>
        </div>
        <div class="card">
          <div class="card-title">⚙️ Architecture Metrics</div>
          <p>• <strong>Runtime:</strong> Node.js ${process.version}</p>
          <p>• <strong>Process PID:</strong> ${process.pid}</p>
          <p>• <strong>Uptime:</strong> ${Math.floor(process.uptime())}s</p>
          <p>• <strong>Memory:</strong> ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB</p>
        </div>
      </div>
      <div class="card">
        <div class="card-title">📜 Real-Time Stream Notification Log (data/events.log)</div>
        <pre>${fs.existsSync(logPath) ? fs.readFileSync(logPath, "utf8") || "No events yet" : "No events yet"}</pre>
      </div>
      </body></html>`;
      return send(res, 200, html, "text/html");
    }

    // GET /teams
    if (req.method === "GET" && req.url === "/teams") {
      return send(res, 200, await store.all());
    }

    // GET /teams/:id
    if (req.method === "GET" && urlParts[0] === "teams" && urlParts.length === 2) {
      const team = await store.find(urlParts[1]);
      return team ? send(res, 200, team) : send(res, 404, { error: "Team not found" });
    }

    // POST /teams
    if (req.method === "POST" && req.url === "/teams") {
      let body;
      try {
        body = JSON.parse(await readBody(req));
      } catch {
        return send(res, 400, { error: "Body must be valid JSON" });
      }
      if (!body.name || !body.sport) {
        return send(res, 422, { error: "Both 'name' and 'sport' are required fields" });
      }
      const added = await store.add({ name: body.name, sport: body.sport, city: body.city || "" });
      return send(res, 201, added);
    }

    // PUT /teams/:id
    if (req.method === "PUT" && urlParts[0] === "teams" && urlParts.length === 2) {
      let body;
      try { body = JSON.parse(await readBody(req)); } catch { return send(res, 400, { error: "Invalid JSON" }); }
      const updated = await store.update(urlParts[1], body);
      return updated ? send(res, 200, updated) : send(res, 404, { error: "Team not found" });
    }

    // DELETE /teams/:id
    if (req.method === "DELETE" && urlParts[0] === "teams" && urlParts.length === 2) {
      const ok = await store.remove(urlParts[1]);
      return ok ? send(res, 204, "") : send(res, 404, { error: "Team not found" });
    }

    // GET /events -> Stream events.log using Readable Stream
    if (req.method === "GET" && req.url === "/events") {
      res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      });
      if (!fs.existsSync(logPath)) {
        return res.end("No events recorded yet.\n");
      }
      return fs.createReadStream(logPath).pipe(res);
    }

    send(res, 404, { error: `Route not found: ${req.method} ${req.url}` });
  } catch (err) {
    console.error(err);
    send(res, 500, { error: "Internal server error" });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏆 Tournament Native Node.js HTTP Server (CO4)`);
  console.log(`🌐 Server running at: http://localhost:${PORT}`);
  console.log(`📁 Records persistence: ${path.join(__dirname, "data", "teams.json")}`);
  console.log(`📜 Event streaming log: ${logPath}`);
  console.log(`=======================================================`);
});
