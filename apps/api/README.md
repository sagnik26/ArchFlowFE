# ArchFlow API

Node.js backend for ArchFlow: auth, HLD/DB/LLD generation via LLM, and design save.

## Setup

1. Copy `.env.example` to `.env` and set:
   - `MONGODB_URI` – MongoDB connection string. Use **local**: `mongodb://localhost:27017/archflow` (start MongoDB first). For **Atlas**, use the full SRV string from the Atlas UI (e.g. `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/archflow`). Do not use a placeholder host like `1234` or the connection will fail with `querySrv ENOTFOUND`.
   - `JWT_SECRET` – Secret for signing JWTs
   - `LLM_API_KEY` – OpenAI API key (used for structured generation)
   - `PORT` – Server port (default `3001`)

2. From repo root: `npm install` (installs all workspaces).

3. Start MongoDB locally or use a cloud instance.

## Run

- From repo root: `npm run dev` (runs both web and API via Turbo).
- API only: `cd apps/api && npm run dev` (listens on `PORT`, default 3001).

The web app (port 8080) proxies `/api` to the API (port 3001) in development.

## Endpoints

- **Auth:** `POST /api/v1/auth/signup`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
- **HLD:** `POST /api/v1/hld/generate`, `POST /api/v1/hld/designs`, `GET /api/v1/hld/designs`, `GET /api/v1/hld/designs/:id`
- **Compatibility:** `POST /api/v1/diagram` (same as HLD generate, for existing frontend)
- **DB:** `POST /api/v1/db/generate`, `POST /api/v1/db/designs`, `GET /api/v1/db/designs`, `GET /api/v1/db/designs/:id`
- **LLD:** `POST /api/v1/lld/generate`, `POST /api/v1/lld/designs`, `GET /api/v1/lld/designs`, `GET /api/v1/lld/designs/:id`
- **Design Studio:** `POST /api/v1/design-studio/generate`, `POST /api/v1/design-studio/save`, `GET /api/v1/design-studio/designs`, `GET /api/v1/design-studio/designs/:id`

All generate/save/designs endpoints require `Authorization: Bearer <token>`.
