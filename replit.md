# ركلة | RAKLA — The Shop

A bilingual Kuwaiti football equipment storefront built as the school project "The Shop".

## Run & Operate

- `pnpm --filter @workspace/rakla run dev` — storefront, using its managed workflow
- `pnpm --filter @workspace/api-server run dev` — run the API server (port supplied by its workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required Replit Secrets: `MONGODB_URI` (MongoDB Atlas URI), `JWT_SECRET` (JWT signing secret)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: MongoDB Atlas + Mongoose
- Validation: Zod (`zod/v4`)
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Mongo models and Atlas connection: `artifacts/api-server/src/lib/`
- API source of truth: `lib/api-spec/openapi.yaml`; regenerate hooks with the codegen command above.
- Storefront and language/theme: `artifacts/rakla/src/`

## Architecture decisions

- The storefront accesses products, accounts, and orders only through the Express API.
- JWTs are held by the browser client and sent in `Authorization: Bearer`; the API validates identity and order ownership.
- If `MONGODB_URI` is missing, the API remains available and the storefront may use the built-in product catalogue as a display-only fallback. Orders and accounts require Atlas.

## Product

Arabic is the default (RTL), with a complete English (LTR) toggle. The catalogue, accounts and orders use MongoDB through the API. Cart and favorites remain browser-only. Checkout is a school-project order record only; no real payment is collected. The teacher's brand board is at `/brand`.

## User preferences

- Keep secrets in Replit Secrets (or ignored local `.env`); never put them in frontend code.
- Hash passwords with bcrypt; never store or return plain-text passwords.
- Use Bearer JWT authentication, and enforce order ownership on every order endpoint.
- Keep all customer-facing screens bilingual with Arabic/RTL as the default.

## Gotchas

- Missing Atlas configuration must not prevent the storefront from rendering; account and order APIs should return a clear service-unavailable response.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
