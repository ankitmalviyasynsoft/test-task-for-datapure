# Task Manager Frontend

Responsive Task Manager web application built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

---

## Prerequisites

- **Node.js**: `v18.0.0+`
- **Backend API**: The Express backend running on `http://localhost:5000` (or your deployed URL)
- **Google OAuth Client ID**

---

## Local Setup & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file based on `.env.example`:
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env.local
   # Mac/Linux
   # cp .env.example .env.local
   ```

   Ensure your `.env.local` contains:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
   ```

3. **Start in development mode**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

- `npm run dev`: Start Next.js development server on port 3000
- `npm run build`: Compile and build optimized production output
- `npm start`: Start production server
- `npm run lint`: Run TypeScript type check
