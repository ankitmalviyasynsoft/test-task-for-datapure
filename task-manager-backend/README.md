# Task Manager Backend

RESTful API backend for the Task Manager application, built with Node.js, Express, TypeScript, and MongoDB.

---

## Prerequisites

- **Node.js**: `v18.0.0+`
- **MongoDB**: Local MongoDB server or MongoDB Atlas connection string
- **Google OAuth Client ID** (for Google ID token verification)

---

## Local Setup & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file based on `.env.example`:
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env
   # Mac/Linux
   # cp .env.example .env
   ```

   Ensure your `.env` contains:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://127.0.0.1:27017/task-manager-db
   JWT_SECRET=super_secret_jwt_key_task_manager_production_2026
   JWT_EXPIRES_IN=7d
   GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
   FRONTEND_URL=http://localhost:3000
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   ```

3. **Start in development mode**:
   ```bash
   npm run dev
   ```
   API will run on `http://localhost:5000`.

4. **Verify health**:
   Visit `http://localhost:5000/api/v1/health`

---

## Available Scripts

- `npm run dev`: Run server with hot reload using `tsx`
- `npm run build`: Compile TypeScript into `dist/`
- `npm start`: Start compiled production server
- `npm test`: Run test suite
- `npm run lint`: Run TypeScript type check

---

## API Summary

- **Authentication**: `POST /api/v1/auth/google`, `GET /api/v1/auth/me`
- **Tasks**:
  - `GET /api/v1/tasks` (with search, filter & pagination)
  - `POST /api/v1/tasks`
  - `GET /api/v1/tasks/stats`
  - `PATCH /api/v1/tasks/reorder`
  - `GET /api/v1/tasks/:id`
  - `PUT /api/v1/tasks/:id`
  - `PATCH /api/v1/tasks/:id/status`
  - `DELETE /api/v1/tasks/:id`
