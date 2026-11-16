# Digiccial To-Do

## Deployment (Vercel)

Deploy the client and server as two Vercel projects from this repository.

1. Create two Vercel projects. Set the backend project's Root Directory to `server` and Framework Preset to `Other`.
2. Set backend environment variables `MONGO_URI` and `CLIENT_URL` (the frontend URL, without a trailing slash). Deploy it, then test `https://<backend>.vercel.app/api/health`.
3. Set the frontend project's Root Directory to `client` and Framework Preset to `Vite`. Use Build Command `npm run build`, Output Directory `dist`, and set `VITE_API_URL=https://<backend>.vercel.app/api`. Redeploy after setting environment variables.
4. In MongoDB Atlas, open Network Access and allow `0.0.0.0/0` so Vercel can reach the database.
5. Troubleshooting: `STATIC_BUILD_NO_OUT_DIR` means the Root Directory is not `client`; a CORS error means `CLIENT_URL` is incorrect; a 404 on refresh means `client/vercel.json` is missing.

For local development, copy `server/.env.example` and `client/.env.example` to `.env` files in their respective folders and set `MONGO_URI` to a reachable MongoDB instance.

A mobile-first MERN task manager matching the Figma design: weekly scheduling (Monday–Sunday), live weekly progress, status controls, expandable week history, search, and swipe-to-delete. The desktop layout retains a focused phone-width surface (max ~430px).

## Tech stack

| Layer | Packages |
|-------|----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Axios, date-fns, lucide-react, Poppins (Google Fonts) |
| Backend | Node.js, Express, MongoDB + Mongoose, dotenv, cors, zod, morgan |
| Dev | concurrently, nodemon, mongodb-memory-server (in-memory DB fallback for local dev) |

No TypeScript on the server; no auth (out of scope).

## Prerequisites

- Node.js >= 18 and npm
- MongoDB (local or Atlas). If no `MONGO_URI` is supplied, the server falls back to an in-memory MongoDB (`mongodb-memory-server`) so `npm run dev` and `npm run seed` work out of the box — data resets on server restart.

## Setup

```bash
# 1. Open this folder
cd c:\Himanshu-Data\Assessments\Digiccial

# 2. Environment files
copy server\.env.example server\.env
copy client\.env.example client\.env
# Edit server/.env if you have a real MongoDB URI; otherwise the in-memory fallback is used.

# 3. Install all dependencies (root + client + server workspaces)
npm install

# 4. Start server + client together
npm run dev
# Server: http://localhost:5000   Client: http://localhost:5173

# 5. Seed sample data (15 tasks across 3 weeks). Also runs automatically on first server start if the DB is empty.
npm run seed
```

### Environment variables

`server/.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/digiccial_todo
PORT=5000
CLIENT_URL=http://localhost:5173
```

`client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## Scripts

| Command | Where | Purpose |
|---------|-------|---------|
| `npm run dev` | root | Starts Express (nodemon) and Vite together |
| `npm run seed` | root/server | Clears and seeds 15 sample tasks across 3 weeks |
| `npm run build` | root/client | Production client bundle |
| `npm run dev` | server | Express with nodemon |
| `npm run start` | server | Express production start |
| `npm run dev` | client | Vite dev server |
| `npm run build` | client | Vite production build |

## API documentation

Base URL: `http://localhost:5000/api`  
All success responses: `{ success: true, data }`. Errors: `{ success: false, message, errors? }`.  
CORS is enabled for the client origin.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/tasks` | Create a task (zod validated) |
| GET | `/api/tasks?date=YYYY-MM-DD` | Tasks for one day (Tasks Today) |
| GET | `/api/tasks?weekStart=YYYY-MM-DD` | All tasks in that Mon–Sun week |
| GET | `/api/tasks/weeks` | Week cards `{ weekStart, weekEnd, open, completed, total }`, sorted desc |
| GET | `/api/tasks/summary?weekStart=YYYY-MM-DD` | `{ completed, pending, progressPercent }` for one week |
| GET | `/api/tasks/search?q=keyword` | Case-insensitive search on title + description |
| GET | `/api/tasks/:id` | One task |
| PUT | `/api/tasks/:id` | Replace editable task fields |
| PATCH | `/api/tasks/:id/status` | Body `{ status }` — toggle in-progress/completed |
| DELETE | `/api/tasks/:id` | Delete a task |

### Sample requests (Postman-style)

```http
### Create a task
POST /api/tasks
Content-Type: application/json

{
  "title": "Review release",
  "description": "Check the final checklist",
  "date": "2026-11-16",
  "startTime": "10:00",
  "endTime": "10:30",
  "priority": "High"
}

### Tasks for one day
GET /api/tasks?date=2026-11-16

### Tasks for a Monday–Sunday week
GET /api/tasks?weekStart=2026-11-16

### Weekly summary
GET /api/tasks/summary?weekStart=2026-11-16

### Week cards (home history section)
GET /api/tasks/weeks

### Search (title or description)
GET /api/tasks/search?q=groceries

### Get one task
GET /api/tasks/6af96445f0e891c3f21683be

### Update a task

## Folder structure

```
digiccial-todo/                    # root (workspaces: client, server)
├── README.md
├── package.json                   # concurrently dev, seed, build
├── server/                        # Express API
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js              # Express app, CORS, routes, error middleware
│       ├── config/db.js           # Mongoose connect (real URI or in-memory fallback)
│       ├── models/Task.js         # Mongoose schema + indexes
│       ├── controllers/taskController.js
│       ├── routes/taskRoutes.js   # /api/tasks
│       ├── validators/taskValidator.js   # zod schemas
│       ├── middleware/errorHandler.js   # central error handling + async wrapper
│       ├── utils/asyncHandler.js, utils/dates.js
│       └── seed/seed.js           # 15 sample tasks across 3 weeks
└── client/                        # Vite + React app
    ├── package.json
    ├── .env.example
    ├── tsconfig.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        ├── api/client.ts          # Axios instance + response interceptor
        ├── api/tasks.ts           # API client + TypeScript interfaces
        ├── hooks/useTasks.ts      # useTasks, useWeeklySummary
        ├── components/
        │   ├── Toast.tsx
        │   ├── TaskRow.tsx        # swipe-to-delete row with checkbox / edit
        │   ├── TaskSheet.tsx      # add/edit bottom sheet
        │   ├── TaskDetail.tsx     # read-only task sheet
        │   ├── WeekStrip.tsx      # Mon–Sun date strip
        │   ├── SummaryCards.tsx   # complete / pending cards
        │   ├── WeekProgress.tsx   # weekly progress bar
        │   └── WeekCard.tsx       # collapsible week card
        └── pages/
            ├── Onboarding.tsx     # / — skippable via localStorage
            ├── Home.tsx           # /home
            └── Search.tsx         # /search
```

## Screenshots

Add product screenshots here: onboarding, home, add/edit task sheet, task detail, and search.

## Key UX enhancements (per product team feedback)

### Edit sheet — scrollable
- Bottom sheet scrollbars are hidden (`scrollbar-hide` class) so the sheet scrolls smoothly without visible browser scrollbars.

### Add task — FAB opens the sheet immediately
- The floating `+` button now opens the Add Task bottom sheet instantly (previously it did nothing).

### Same-screen search
- No separate `/search` page anymore. The search bar sits at the top of `/home` and filters the task list in real time as you type. Results show with title/description matching, and the header shows the active search query.

### Modern confirmation dialog
- Replaced native `confirm()` alerts with a polished, accessible confirmation modal (`ConfirmDialog`). Used for every delete action across Home, WeekCard, TaskRow, TaskDetail, and Search.

## Assumptions

- Dates are sent as `YYYY-MM-DD` and stored at start of day UTC; week boundaries always use Monday through Sunday (`date-fns startOfWeek` with `weekStartsOn: 1`).
- No authentication or per-user ownership, as requested — all tasks are shared.
- When no `MONGO_URI` is provided, the server uses an in-memory MongoDB for development; seed data resets on server restart. Point `MONGO_URI` at a real database for persistence.
- Task detail interaction is exposed through the task sheet (all fields editable) and the Task Detail view (read-only with Edit/Delete).
- `PUT /tasks/:id` requires the full editable payload (title, date, startTime are mandatory per zod schema).
- End time, when given, must be >= start time.

## Verification checklist

- [x] Create task with title + date + time; missing mandatory fields show inline errors
- [x] Edit updates every field including priority
- [x] Delete via trash icon, swipe-left, and confirmation dialog
- [x] Same-screen search by title and description (real-time, no page navigation)
- [x] Weeks start Monday and end Sunday everywhere
- [x] Weekly cards show correct open/completed counts and expand to list tasks
- [x] Marking complete instantly updates counts, summary cards, and progress bar (optimistic with rollback)
- [x] Edit sheet scrolls cleanly with hidden scrollbars
- [x] Add task FAB opens the sheet immediately
- [x] Modern toast/confirm dialogs replace native `alert()`/`confirm()`
- [x] UI matches the Figma tokens: royal blue #4169E1, navy #243C9E, track #D8DAF8, done #E8EDFF, pending #FFE4E4, page #FAFAFC, Poppins
- [x] Runs with `npm install && npm run dev`; seed script works; production build passes
PUT /api/tasks/6af96445f0e891c3f21683be
Content-Type: application/json

{
  "title": "Updated title",
  "description": "New details",
  "date": "2026-11-16",
  "startTime": "11:00",
  "endTime": "",
  "priority": "Low"
}

### Toggle status
PATCH /api/tasks/6af96445f0e891c3f21683be/status
Content-Type: application/json

{ "status": "completed" }

### Delete
DELETE /api/tasks/6af96445f0e891c3f21683be
```
