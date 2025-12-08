# Divorce Women Empowerment — Development README

This repository contains a full-stack web application (backend + frontend) for community support, blogs, messaging and expert listings.

This README explains how to run the project locally for development.

## Prerequisites

- Node.js (v18+ recommended) and npm
- MongoDB (Atlas, no need of local instance)
- A terminal (zsh on macOS is fine)

## Repository layout

- `backend/` — Express + Mongoose API and Socket.IO server
- `frontend/` — React (Vite) single-page app
- `mongodb/` — optional scripts for creating collections / sample data

## Backend — install & run

1. Open a terminal and change to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start in development mode (uses `nodemon`):

```bash
npm run dev
```

The backend server listens on `http://localhost:5000` by default and exposes the API under `/api/*` (for example `http://localhost:5000/api/community`). The Socket.IO server is attached to the same HTTP server.

## Frontend — install & run

1. Open another terminal and change to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the dev server (Vite):

```bash
npm run dev
```

The frontend dev server runs on `http://localhost:5173` by default. It communicates with the backend API at `http://localhost:5000/api` and connects to the Socket.IO server at `http://localhost:5000` (the backend allows `http://localhost:5173` by default).

If you change ports or hostnames, update `CLIENT_ORIGIN` in the backend `.env` accordingly so Socket.IO/CORS allow the frontend origin.
