# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

教学用个人主页评论系统 — a personal portfolio site with visitor comments, admin login, and comment moderation. Built as a classroom project scaffold; core comment and admin logic is intentionally incomplete and implemented progressively.

## Commands

```bash
npm install                # Install frontend dependencies
cp .env.example .env.local # Create local env file (required before dev:full)
npm run dev                # Vite dev server only (Phases 1-3, no backend)
npm run dev:full           # Express API (port 3000) + Vite (proxied) concurrently (Phases 4+)
                           # Auto-installs API deps in cloudfunctions/functions/api/node_modules/
npm run build              # TypeScript check (tsc -b) then Vite production build
npm run lint               # ESLint across the project (src TS/TSX + cloudfunctions JS)
npm run preview            # Preview production build locally
```

Cloud function deployment:

```bash
cd cloudfunctions
./deploy.sh                # Deploy the CloudBase single-function API
```

## Architecture

**Dual runtime**: Vite/React/TypeScript frontend (ESM) + Express API on CloudBase (CommonJS). The two sides share types conceptually but run in separate Node environments — the frontend uses `src/types/`, the API defines its own shapes.

```
Browser
  -> React pages (src/pages/)
  -> Service layer (src/services/http.ts -> /api)
  -> [dev] Vite proxy -> localhost:3000
  -> [prod] HTTP trigger -> CloudBase single function
  -> Express app (cloudfunctions/functions/api/app.js)
  -> CloudBase cloud database (comments collection)
```

**Frontend layers** (`src/`):
- `pages/` — route-level components, contain layout + composition only
- `components/` — reusable UI pieces (NavBar, CommentForm, CommentList, etc.)
- `services/` — all HTTP calls through a shared `request<T>()` helper in `http.ts`; pages never call fetch directly
- `data/` — static content (profile info, project listings); never goes to the database
- `types/` — shared TypeScript types (`Project`, `Comment`, `ApiResult<T>`, etc.)

**Backend layers** (`cloudfunctions/functions/api/`):
- `index.js` — CloudBase entry point, wraps Express via `serverless-http`
- `app.js` — Express app: CORS, JSON parsing, route mounting
- `dev.js` — local dev server (loads `.env.local` via dotenv, listens on port 3000)
- `db.js` — CloudBase SDK initialization (`@cloudbase/node-sdk`)
- `routes/comments.js` — public comment endpoints
- `routes/admin.js` — admin auth + comment management endpoints
- `middleware/auth.js` — Bearer token verification
- `utils/token.js` — HMAC-SHA256 token sign/verify

**Data flow rule**: Frontend never talks to the database directly. All read/write goes through `src/services/` -> `/api` -> Express routes -> CloudBase SDK.

**Routing**:
| Path | Page | Auth |
|---|---|---|
| `/` | HomePage | Public |
| `/projects/:id` | ProjectDetailPage | Public |
| `/admin/login` | AdminLoginPage | Public |
| `/admin/comments` | AdminCommentsPage | Token required (AdminGuard) |

**API endpoints** (all under `/api`):
| Method | Path | Auth |
|---|---|---|
| GET | `/api/health` | None |
| GET | `/api/comments?projectId=xxx` | None |
| POST | `/api/comments` | None |
| POST | `/api/admin/login` | None |
| GET | `/api/admin/comments` | Bearer token |
| DELETE | `/api/admin/comments/:id` | Bearer token |

Unified response shape: `{ success: boolean, data?: T, message?: string }`

## Key Constraints

- Node 20 (`.nvmrc`). The API side is CommonJS (`type: "commonjs"`), the frontend is ESM (`type: "module"`). Use `require()` in cloudfunctions, `import` in src.
- Only comments go in the database (`comments` collection). Personal info and projects are static files in `src/data/`.
- Admin credentials live in environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET`) — never in frontend code.
- `src/services/http.ts` reads `VITE_API_BASE` env var; when empty, requests go to the Vite proxy (local dev).
- TypeScript is strict: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` all enabled.
- ESLint lints both `src/**/*.{ts,tsx}` and `cloudfunctions/functions/api/**/*.js` with separate rule sets.
- Never let frontend code talk to the database directly — always through `/api` endpoints.
- Never scatter API calls in page components — all HTTP goes through `src/services/`.

## Project Workflow

This project follows a structured development process. `AGENTS.md` at the repo root contains the full mandatory rules — read it before writing any code.

**Before coding any task**:
1. Read `memory-bank/TASKS.md` to find the current task number.
2. Read the relevant context docs: `memory-bank/PRD.md`, `DESIGN.md`, `TECH_STACK.md`, `DATA_MODEL.md`, `ARCHITECTURE.md`.
3. Only then write code.

**While coding**:
- Work on exactly one task at a time, in order. Do not implement ahead.
- Do not add features outside `TASKS.md`.
- Align pages/interactions with `DESIGN.md`, data fields/APIs with `DATA_MODEL.md`, file responsibilities with `ARCHITECTURE.md`.

**After completing a task**:
- Update `memory-bank/PROGRESS.md`.
- If architecture changed → sync `memory-bank/ARCHITECTURE.md`.
- If data fields or APIs changed → sync `memory-bank/DATA_MODEL.md`.

**When editing memory-bank docs**: read the full file first, prioritize filling `TODO` markers, and reconcile existing content against the current PRD/prototype. Don't add features beyond the classroom scope.
