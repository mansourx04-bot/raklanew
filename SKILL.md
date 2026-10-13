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
- Never trigger a page reload or native full-page redirect for app interactions. Sign up, log in, log out, cart updates, checkout, My Orders, and language changes must update through React state and Wouter navigation; do not use `window.location.reload()`, `location.href`/`assign`/`replace`, native internal form actions, or polling refreshes.
- Do not poll the API to refresh these flows. A local countdown may update its own display, but must not reload the page or repeatedly refetch data.
