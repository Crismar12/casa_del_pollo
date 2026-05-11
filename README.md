# 🍗 La Casa de Pollo - Order Manager

Restaurant order management system developed with React, TypeScript, and Supabase.

## 📋 Description

Modern web application for comprehensive restaurant order management, including administrative features, a product catalog, a shopping cart, and order tracking.

## ✨ Features

- 🔐 **User Authentication** with Supabase
- 🛒 **Shopping Cart** with Product Management
- 📦 **Real-Time Order Management**
- 👨‍💼 **Complete Admin Panel**
- 📱 **Responsive Design** for Mobile and Tablets
- 📊 **Data Visualization** with Charts (Recharts)
- 🎨 **Modern UI** with Tailwind CSS and Headless UI

## 🛠️ Technology Stack

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
- **Supabase** - Backend as a Service

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **Supabase** - Database and Authentication
- **CORS** - Security Configuration

## 📁 Project Structure

```
la-casa-de-pollo-gestor-pedidos/
├── src/
│ ├── features/ # Features per Module
│ │ ├── admin/
│ │ ├── auth/
│ │ ├── cart/
│ │ ├── orders/
│ │ └── products/
│ ├── pages/ # Application Pages
│ ├── shared/ # Shared Components and Utilities
│ ├── store/ # Redux Configuration
│ ├── routes/ # Route Configuration
│ └── config/ # General Configurations
├── backend/ # Backend API
│ └── src/
├──db.sql # Database Script
└── public/ # Static Files

```

## 🚀 Installation and Configuration

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn

### Frontend Installation

```bash
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

Create a `.env` file in the project root with the following variables:

```send
VITE_SUPABASE_URL=https://ytuzhqypnfkcptetvadl.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_API_URL=http://localhost:4000
SUPABASE_URL=https://ytuzhqypnfkcptetvadl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=4000
```

For the backend, there is also the file [`backend/.env.example`](backend/.env.example). The recommended way to use it is to copy it to [`backend/.env`](backend/.env) and complete the `SUPABASE_SERVICE_ROLE_KEY`:

```powershell
Copy-Item backend\.env.example backend\.env
```

If you prefer to do it manually, make sure the backend has at least these variables:

```env
SUPABASE_URL=https://ytuzhqypnfkcptetvadl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=4000
```

## ▶️ How to start the app

1. Install dependencies in the root directory:

```bash
npm install
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Create the file From the example backend environment:

```powershell
Copy-Item backend\.env.example backend\.env
```

4. Start the backend:

```bash
cd backend
npm run dev
```

5. In another terminal, start the frontend:

```bash
npm run dev
```

## 📝 Important Notes

- The frontend uses the `VITE_*` variables from the root `.env` file.

- The backend should not use `SERVICE_ROLE_KEY` in `VITE_*` variables.

- If you change the `.env` file, restart the corresponding process so that it loads the new values.

## 📄 Available Scripts

### Frontend
- `npm run dev` - Starts the development server
- `npm run build` - Compiles the application for production
- `npm run preview` - Previews the production build
- `npm run lint` - Runs the ESLint linter

### Backend
- `npm run dev` - Starts the backend server with nodemon

## 🎯 Main Pages

- **Login** - User authentication
- **Products** - Catalog of available products
- **Cart** - Shopping cart management
- **Orders** - Order history and tracking
- **Admin** - Admin panel

## 🔧 Development Technologies

- ESLint - Code linting
- TypeScript ESLint - Specific rules for TypeScript
- PostCSS - CSS processing
- Autoprefixer - Automatic prefixes CSS

---

Developed with ❤️
