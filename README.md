# La Casa de Pollo - Order Manager

Restaurant order management system developed with React, TypeScript, Express, and Neon.tech (PostgreSQL).

## Description

Modern web application for comprehensive restaurant order management, including administrative features, a product catalog, a shopping cart, and order tracking.

## Features

- **User Authentication** with email and password
- **Shopping Cart** with Product Management
- **Order Management** with status tracking
- **Complete Admin Panel** with sales dashboard and charts
- **Responsive Design** for Mobile and Tablets
- **Data Visualization** with Charts (Recharts)
- **Modern UI** with Tailwind CSS and Headless UI

## Technology Stack

### Frontend
- **React 19.2** - UI Library
- **TypeScript** - Static Typing
- **Vite** - Build Tool and Dev Server
- **React Router DOM** - Routing
- **Redux Toolkit** - State Management
- **Tailwind CSS** - Utility Styles
- **Headless UI** - Accessible Components
- **Heroicons & Lucide React** - Iconography
- **Recharts** - Data Visualization

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **Neon.tech** - Serverless PostgreSQL
- **pg** (node-postgres) - PostgreSQL client
- **CORS** - Security Configuration

## Project Structure

```
la-casa-de-pollo-gestor-pedidos/
├── frontend/                       # Frontend (React + Vite)
│   ├── src/
│   │   ├── features/               # Features per Module
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   └── products/
│   │   ├── pages/                  # Application Pages
│   │   ├── shared/                 # Shared Components and Utilities
│   │   ├── store/                  # Redux Configuration
│   │   ├── routes/                 # Route Configuration
│   │   └── config/                 # General Configurations
│   ├── public/                     # Static Files
│   ├── index.html                  # Entry HTML
│   ├── vite.config.ts              # Vite Configuration
│   └── package.json                # Frontend Dependencies
├── backend/                        # Backend API (Express)
│   └── src/
│       ├── config/                 # Database configuration
│       ├── controllers/            # HTTP controllers
│       ├── repositories/           # Data access layer (SQL queries)
│       ├── routes/                 # API routes
│       ├── services/               # Business logic
│       └── types/                  # TypeScript types
├── db.sql                          # Database Script (PostgreSQL)
├── README.md                       # Project Documentation
└── .gitignore                      # Git ignore rules
```

## Installation and Configuration

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- A Neon.tech account (https://neon.tech)

### Frontend Installation

```bash
cd frontend

# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Build preview
npm run preview

# Run linter
npm run lint
```

### Backend Installation

```bash
cd backend

# Install dependencies
npm install

# Development mode
npm run dev
```

### Environment Variables

#### Frontend (`frontend/.env`)

```env
VITE_BACKEND_API_URL="http://localhost:4000"
```

See [`frontend/.env.example`](frontend/.env.example) for reference.

#### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://neondb_owner:<YOUR_PASSWORD>@<YOUR_ENDPOINT>.neon.tech/neondb?sslmode=require"
PORT=4000
```

Replace `<YOUR_PASSWORD>` and `<YOUR_ENDPOINT>` with your Neon.tech credentials.

See [`backend/.env.example`](backend/.env.example) for reference.

### Database Setup

1. Log in to your [Neon.tech](https://neon.tech) dashboard
2. Create a new project
3. Copy the connection string from the dashboard
4. Paste it in `backend/.env` as `DATABASE_URL`
5. Run the `db.sql` script in the Neon SQL editor to create all tables

## How to Start the App

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Configure environment variables:

```bash
# Frontend
Copy-Item frontend\.env.example frontend\.env

# Backend
Copy-Item backend\.env.example backend\.env
# Edit backend\.env and add your Neon DATABASE_URL
```

4. Set up the database in Neon.tech (see Database Setup above)

5. Start the backend:

```bash
cd backend
npm run dev
```

6. In another terminal, start the frontend:

```bash
cd frontend
npm run dev
```

## Deployment

### Frontend (Vercel)
- **Framework:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Backend (Render)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm run dev`

## Important Notes

- The frontend uses `VITE_BACKEND_API_URL` to connect to the backend API.
- The backend connects to Neon.tech PostgreSQL via `DATABASE_URL`.
- If you change any `.env` file, restart the corresponding process.
- Never commit `.env` files to version control.

## Available Scripts

### Frontend
- `npm run dev` - Starts the development server
- `npm run build` - Compiles the application for production
- `npm run preview` - Previews the production build
- `npm run lint` - Runs the ESLint linter

### Backend
- `npm run dev` - Starts the backend server with nodemon

## Main Pages

- **Login** - User authentication
- **Products** - Catalog of available products
- **Cart** - Shopping cart management
- **Orders** - Order history and tracking
- **Admin** - Admin panel with sales dashboard

## Development Technologies

- ESLint - Code linting
- TypeScript ESLint - Specific rules for TypeScript
- PostCSS - CSS processing
- Autoprefixer - Automatic CSS prefixes

---

Developed with love
