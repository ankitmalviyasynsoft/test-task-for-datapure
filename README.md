# Task Manager Application

A modern, full-stack Task Management application featuring an interactive drag-and-drop Kanban board, customizable theme settings, real-time analytics, and secure Google OAuth authentication.

Built with **Next.js 14+ (App Router)** and **Express.js + TypeScript + MongoDB**.

---

## Prerequisites

Make sure you have the following installed on your local machine:

- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (bundled with Node.js)
- **MongoDB**: Either a local instance running on `mongodb://127.0.0.1:27017` or a free cloud cluster from [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Google OAuth Client ID** (optional for local testing, required for Google sign-in): Obtain from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

---

## Project Structure

```
test-task-for-datapure/
├── task-manager-backend/    # Express.js REST API with TypeScript & MongoDB
└── task-manager-frontend/   # Next.js 14 App Router with Tailwind CSS
```

---

## Quick Start (Run Locally)

Follow these steps to set up and run both the backend and frontend on your computer.

### Step 1: Set Up & Run the Backend

Open a terminal window and run:

```bash
# 1. Navigate to backend directory
cd task-manager-backend

# 2. Install dependencies
npm install

# 3. Create the environment file
# On Windows PowerShell:
Copy-Item .env.example .env
# On Mac/Linux:
# cp .env.example .env
```

Verify or configure your `.env` file in `task-manager-backend/.env`:
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

Start the backend server:
```bash
npm run dev
```
The backend API is now running at `http://localhost:5000`.  
Verify health by visiting: `http://localhost:5000/api/v1/health`

---

### Step 2: Set Up & Run the Frontend

Open a **new** terminal window and run:

```bash
# 1. Navigate to frontend directory
cd task-manager-frontend

# 2. Install dependencies
npm install

# 3. Create the local environment file
# On Windows PowerShell:
Copy-Item .env.example .env.local
# On Mac/Linux:
# cp .env.example .env.local
```

Verify your `.env.local` file in `task-manager-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

Start the frontend development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Core Features

- **Google OAuth Authentication**: Secure one-click Google Sign-In with server-side token verification and JWT session management.
- **Drag & Drop Kanban Board**: Move tasks across *Pending*, *In Progress*, and *Completed* columns with smooth instant updates.
- **Table / List View**: Switch between Kanban view and tabular view with inline status editing.
- **Search & Filter**: Real-time debounced title/description search, filter by priority and status, and sort by date or priority.
- **Custom Theme & Appearance Settings**:
  - Font choice: Inter, Plus Jakarta Sans, Roboto, Outfit, System Default
  - Primary colors: Indigo, Violet, Blue, Emerald, Rose, Amber
  - Corner radius: Sharp, Subtle, Medium, Smooth, Pill
  - Border thickness: Thin, Default, Thick
  - Dark / Light mode toggle
- **Custom Styled Select Component**: Fully custom dropdowns replacing generic native HTML selects.
- **Error Boundaries & Loading Skeletons**: Global and component-level crash protection with pulse skeleton placeholders.

---

## Available Scripts

### Backend (`task-manager-backend/`)
- `npm run dev`: Start backend with hot reload using `tsx`
- `npm run build`: Compile TypeScript into JavaScript (`dist/`)
- `npm start`: Run compiled production server
- `npm test`: Run backend automated tests
- `npm run lint`: Run TypeScript type check

### Frontend (`task-manager-frontend/`)
- `npm run dev`: Start Next.js development server on port 3000
- `npm run build`: Build production optimized application
- `npm start`: Start production server
- `npm run lint`: Run TypeScript type check
