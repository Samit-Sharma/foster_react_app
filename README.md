# Fastor React Task

React (Vite) app: Signup → OTP → Home (restaurants from API) → Item details.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
```

## API (staging.fastor.ai)
- POST `/v1/pwa/user/register` – `phone`, `dial_code` → sends OTP
- POST `/v1/pwa/user/login` – `phone`, `otp` (default `123456`), `dial_code` → JWT in `data.token`
- GET `/v1/m/restaurant?city_id=118` – sent with `Authorization: Bearer <token>`

Requests go to `/api/...`, proxied to staging by Vite (dev) and by `vercel.json` / `public/_redirects` (production), so there are no CORS problems.

## Deploy
Push to GitHub, import the repo in Vercel or Netlify (build: `npm run build`, output: `dist`).
