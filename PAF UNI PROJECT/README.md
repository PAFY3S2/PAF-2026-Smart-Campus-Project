# SLIIT Facility Flow — PAF Project

A monorepo containing a **React + Vite** frontend and a **Node.js + Express** backend.

## Project Structure

```
PAF UNI PROJECT/
├── frontend/        ← React + Vite (Tailwind CSS)
│   ├── src/         ← Components, pages, routes, services
│   ├── public/      ← Static assets (favicon, icons)
│   ├── dist/        ← Production build output (gitignored)
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
├── backend/         ← Node.js + Express + MongoDB
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Getting Started

### Frontend
```bash
cd frontend
npm install        # only needed once / after pulling
npm run dev        # start Vite dev server → http://localhost:5173
```

### Backend
```bash
cd backend
npm install        # only needed once / after pulling
node server.js     # start Express API → http://localhost:5000
```

> Both servers must be running at the same time for the app to work.
