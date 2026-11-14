const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const pathname = req.url.split("?")[0];
  let file = pathname === "/" ? "/index.html" : pathname;
  let filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("Not Found");
  }
  let ext = path.extname(filePath);
  let contentType = ext === ".html" ? "text/html" : ext === ".json" ? "application/json" : "text/plain";
  res.writeHead(200, { "Content-Type": contentType, "Access-Control-Allow-Origin": "*" });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(8085, () => console.log("http://localhost:8085"));
