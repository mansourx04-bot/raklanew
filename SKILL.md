# RAKLA Project Agent Rules

## Stack
- React storefront + Express API + MongoDB Atlas via Mongoose.
- The API is the only path to application data; the frontend never connects to MongoDB directly.

## Rules
- Keep `MONGODB_URI` and `JWT_SECRET` only in Replit Secrets or a local `.env` file that is ignored by Git. Never hard-code, print, return, or expose secret values.
- Read MongoDB connection settings only on the server. When Atlas is not configured, log a clear warning and keep the storefront available.
- Hash passwords with bcrypt before storage. Never store, log, or return plain-text passwords.
- Send JWTs using `Authorization: Bearer <token>` on protected API requests. Clear the stored token on logout.
- Every protected route checks authentication. Every record-specific route also checks authorization/ownership on the server.
- Preserve the RAKLA identity and the Arabic-default RTL / English LTR language toggle on every screen.
