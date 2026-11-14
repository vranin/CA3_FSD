Local: backend -> cp .env.example .env, fill MONGO_URI, npm i, npm start. frontend -> cp .env.example .env, npm i, npm run dev.
Render (backend): New Web Service, root dir "backend", build "npm install", start "npm start", env MONGO_URI + FRONTEND_URL (your Vercel URL).
Vercel (frontend): import repo, root dir "frontend", framework Vite, env VITE_API_URL = your Render URL.
