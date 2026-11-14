npm install && npm start
curl -X POST localhost:4000/auth/register -H "Content-Type: application/json" -d '{"username":"admin","password":"secret1"}'
curl -X POST localhost:4000/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"secret1"}'
curl -X POST localhost:4000/api/teams -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d '{"name":"Tigers","sport":"Football"}'
