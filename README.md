# ArchFlow

> LLM-powered architecture design studio: turn natural language into High-Level Design, Database schemas, and Low-Level Design.

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-20+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

ArchFlow is a full-stack application that helps engineers generate software architecture artifacts from a single prompt:

- **HLD** – System diagrams (components, layers, relationships) with React Flow visualization
- **DB** – Entity-relationship schemas (entities, attributes, relationships)
- **LLD** – Low-level design (classes, APIs with endpoints and status codes)

The project is a **monorepo** with a React frontend (`apps/web`) and Node/Express API (`apps/api`). The API uses OpenAI with JSON mode and Zod validation; designs are stored in MongoDB.

## Features

- **Design Studio** – One prompt triggers sequential HLD → DB → LLD generation; each canvas appears as soon as its step completes
- **Auth** – Signup / login with JWT; protected routes for studio, audit trails, token usage
- **Persistence** – Save and list designs (HLD, DB, LLD, or full Design Studio payloads)
- **Progressive UI** – HLD canvas shows when HLD is ready; DB and LLD update step-by-step
- **Structured output** – All LLM responses validated with Zod before storage or display

## Tech Stack

| Layer    | Stack |
| -------- | ----- |
| Frontend | React 18, TypeScript, Vite, React Router, Tailwind, Radix UI, React Flow, Framer Motion, Zustand |
| Backend  | Node.js, Express, TypeScript, Mongoose, OpenAI SDK, Zod, JWT, bcrypt |
| Data     | MongoDB |
| Tooling  | Turbo (monorepo), ESLint, tsx |

## Project Structure

```
ArchFlowFE/
├── package.json          # Workspace root (turbo, workspaces: apps/*)
├── apps/
│   ├── api/              # Backend
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── services/llm.ts       # OpenAI generateStructured
│   │   │   ├── hld/                 # HLD generate, save, list, getById
│   │   │   ├── db/                  # DB generate, save, list, getById
│   │   │   ├── lld/                 # LLD generate, save, list, getById
│   │   │   ├── designStudio/        # Full pipeline + save/list/getById
│   │   │   ├── auth/               # Signup, login, /me
│   │   │   ├── models/             # User, Design
│   │   │   └── validators/         # diagram, dbDesign, lldDesign
│   │   ├── .env.example
│   │   └── package.json
│   └── web/              # Frontend
│       ├── src/
│       │   ├── App.tsx
│       │   ├── pages/              # DesignStudio, Login, Signup, AuditTrails, TokenUsage
│       │   ├── components/        # ProfileMenu, ProtectedRoute, design-studio/*
│       │   ├── contexts/AuthContext.tsx
│       │   ├── store/designContext
│       │   └── types/
│       ├── vite.config.ts          # Proxy /api to API server
│       └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** 20+ (LTS)
- **MongoDB** (local or Atlas)
- **OpenAI API key**

### 1. Clone and install

```bash
git clone https://github.com/your-org/ArchFlowFE.git
cd ArchFlowFE
npm install
```

### 2. Configure the API

```bash
cd apps/api
cp .env.example .env
```

Edit `apps/api/.env`:

```env
PORT=3001
MONGODB_URI=mongodb+srv://user:password@host/dbname
JWT_SECRET=your-secret
LLM_API_KEY=sk-...
```

Use a real MongoDB URI (e.g. encode `@` in password as `%40` for Atlas).

### 3. Run the app

From the **repo root**:

```bash
npm run dev
```

This starts both apps (Turbo): API on **http://localhost:3001**, web on **http://localhost:5173**. The Vite dev server proxies `/api` to the API.

Or run separately:

```bash
# Terminal 1 – API
cd apps/api && npm run dev

# Terminal 2 – Web
cd apps/web && npm run dev
```

### 4. Use the Design Studio

1. Open http://localhost:5173
2. Sign up or log in
3. Go to **Design Studio**
4. Enter a system description (e.g. “E-commerce platform with orders, payments, and inventory”)
5. Click **Generate** – HLD appears first, then DB, then LLD
6. Use **Save** to persist the full design

## Scripts

| Command        | Description |
| -------------- | ----------- |
| `npm run dev`  | Run all apps in dev mode (Turbo) |
| `npm run build`| Build all apps |
| `npm run lint` | Lint all apps |
| `npm run preview` | Preview web build |

In `apps/api`: `npm run dev` (tsx watch), `npm run build`, `npm start`.  
In `apps/web`: `npm run dev` (Vite), `npm run build`, `npm run preview`.

## Environment

| Variable      | App  | Description |
| ------------- | ---- | ----------- |
| `PORT`        | API  | Server port (default 3001) |
| `MONGODB_URI` | API  | MongoDB connection string |
| `JWT_SECRET`  | API  | Secret for signing JWTs |
| `LLM_API_KEY` | API  | OpenAI API key |

## Roadmap

- **Conversation storage** – Persist chat/conversation history per user
- **Intent classification** – Route off-topic vs design-related messages
- **Chat UI** – Full chat interface with design artifacts linked to messages
- **RAG** – Retrieve over past designs and docs for context-aware generation
- **Fine-tuning** (optional) – Stricter schema/style once enough data exists

## License

MIT (or add your chosen license).

---

**ArchFlow** – From prompt to architecture, step by step.
