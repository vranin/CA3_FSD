node server.js
curl localhost:3000/teams
curl -X POST localhost:3000/teams -H "Content-Type: application/json" -d '{"name":"Tigers","sport":"Football"}'
curl localhost:3000/events
