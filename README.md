# Fastor OTP React App

A complete Vite + React frontend using the supplied Fastor staging API:
- `POST /v1/pwa/user/register` — requests/sends an OTP.
- `POST /v1/pwa/user/login` — verifies the OTP and returns the user/session response.
- `GET /v1/m/restaurant?city_id=118&&` — loads restaurants after successful login.

## OTP behavior
The UI pre-fills `123456` for convenient staging/testing. The Verify button only proceeds when the entered OTP is exactly `123456`, then calls the real login endpoint. The backend login response is still checked; a successful response is required before the app considers the user logged in.

This fixed OTP rule is for the requested frontend demo/staging behavior only. Do not use a hard-coded OTP in a production authentication flow.

## Run locally
1. Install Node.js (LTS).
2. Extract this ZIP and open the project folder in a terminal.
3. Run `npm install`.
4. Copy `.env.example` to `.env` (or configure the variables in your environment).
5. Run `npm run dev`.
6. Open the local URL printed by Vite, usually `http://localhost:5173`.

## API payloads
Register:
```json
{ "phone": "9818979450", "dial_code": "+91" }
```
Login:
```json
{ "phone": "9818979450", "otp": "123456", "dial_code": "+91" }
```

## Notes
- The app does not hard-code a session token.
- The restaurant endpoint returns a paginated `data.results` list; this UI displays the returned results and shows the total count when available.
- If your API rejects browser requests due to CORS, allow your local frontend origin on the API server.
