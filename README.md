# 🐔 El Paraíso del Pollo — Gestor de Pedidos

https://paraiso-del-pollo.vercel.app/

Sistema de gestión de pedidos para restaurante desarrollado con React, TypeScript, Express, PostgreSQL (Neon.tech) y Cloudinary.

<img width="1852" height="852" alt="paraiso_pollo" src="https://github.com/user-attachments/assets/978c2d12-e24b-41a4-a923-3a0ea52357db" />

<img width="1456" height="781" alt="paraiso_pollo2" src="https://github.com/user-attachments/assets/766fb437-26cd-4850-bab1-1dd3202ce336" />


## 🚀 Demo

| Rol | Email | Contraseña |
|---|---|---|
| Admin | `admin@demo.com` | `admin123` |
| Vendedor | `vendedor@demo.com` | `vend123` |

Carga datos de demo con:

```bash
cd backend
npm run seed
```

## ✨ Funcionalidades

- **Autenticación** — JWT con access + refresh tokens, bcrypt, roles (admin/vendedor)
- **Menú de productos** — Catálogo con filtros por categoría, carrito de compras
- **Pedidos** — Creación, seguimiento de estados (pendiente → preparación → reparto → entregado/cancelado), exportación PDF
- **Panel admin** — Dashboard con KPIs, gráficos semanales, productos más vendidos, tasa de cancelación
- **CRUD completo** — Productos, categorías y usuarios con soft-delete (nunca se borran registros con pedidos)
- **Modo oscuro** — Toggle sol/luna con detección de preferencia del sistema, sin flash al cargar
- **Seguridad** — Helmet, rate limiting, CORS, Zod validación, logger con masking de datos sensibles
- **Lazy loading** — Imágenes, rutas code-split con React.lazy + Suspense, skeleton loaders
- **Migraciones** — Sistema numerado con auto-ejecución al iniciar el servidor
- **Responsive** — Mobile-first con Tailwind CSS, sidebar con overlay

## 🛠 Stack tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| React 19 + TypeScript | UI y tipado |
| Vite 7 | Build tool y dev server |
| Redux Toolkit | Estado global (carrito) |
| React Router DOM 7 | Routing con lazy loading |
| Tailwind CSS 4 | Estilos utilitarios + dark mode |
| Recharts | Gráficos del dashboard |
| jspdf + jspdf-autotable | Exportación PDF |
| Lucide React | Iconografía |
| Headless UI | Componentes accesibles |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express 5 | API REST |
| TypeScript | Tipado |
| PostgreSQL (Neon.tech) | Base de datos serverless |
| pg (node-postgres) | Driver PostgreSQL |
| JWT + bcrypt | Autenticación y hash |
| Zod | Validación de schemas |
| Helmet | Headers de seguridad |
| express-rate-limit | Rate limiting |
| Cloudinary | Almacenamiento de imágenes |
| geoip-lite | Detección de zona horaria |
| @faker-js/faker | Datos de demo (seed) |

## 📁 Estructura

```
el-paraiso-del-pollo/
├── frontend/
│   └── src/
│       ├── features/          # Módulos: admin, auth, cart, orders, products
│       ├── pages/             # Páginas: Login, ProductPage, CartPage, OrdersPage, AdminPage, NotFoundPage
│       ├── shared/            # Componentes IU, hooks, context, utils
│       ├── routes/            # AppRouter, PrivateRoutes, AdminRoute
│       └── store/             # Redux store
├── backend/
│   ├── src/
│   │   ├── config/            # DB, CORS, tokens, migraciones
│   │   ├── controllers/       # HTTP handlers
│   │   ├── middleware/         # Auth, authorize, rateLimiter, validate, errorHandler
│   │   ├── repositories/      # SQL queries parametrizadas
│   │   ├── routes/            # Definición de endpoints
│   │   ├── schemas/           # Zod schemas de validación
│   │   ├── services/          # Lógica de negocio
│   │   ├── types/             # Interfaces TypeScript
│   │   └── utils/             # Logger con masking
│   └── migrations/            # SQLs numerados
├── db.sql                     # Schema de referencia
└── render.yaml                # Deploy en Render
```

## 🚀 Instalación local

### Requisitos
- Node.js ≥ 18
- Cuenta en [Neon.tech](https://neon.tech) (gratis)
- Cuenta en [Cloudinary](https://cloudinary.com) (gratis)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de Neon y Cloudinary
npm run dev        # http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev        # http://localhost:3000
```

### Base de datos

```bash
cd backend
npm run migrate    # Ejecuta migraciones pendientes
npm run seed       # Carga datos de demo
```

## 📦 Deploy

### Backend — Render

1. Conectar repo en [Render](https://render.com)
2. Crear **Web Service** usando `render.yaml` (Blueprints) o manual:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/`
3. Configurar variables de entorno en el dashboard de Render:
   - `DATABASE_URL` — tu string de conexión de Neon
   - `JWT_SECRET` — generar con `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - `JWT_REFRESH_SECRET` — otro secret distinto
   - `CORS_ORIGIN` — URL del frontend en Vercel (ej. `https://el-paraiso.vercel.app`)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Frontend — Vercel

1. Conectar repo en [Vercel](https://vercel.com)
2. Configurar:
   - **Framework:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Variable de entorno en Vercel:
   - `VITE_BACKEND_API_URL` — URL del backend en Render

## 📝 Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Default |
|---|---|---|
| `DATABASE_URL` | String de conexión Neon.tech | — |
| `PORT` | Puerto del servidor | `4000` |
| `JWT_SECRET` | Firma de access tokens | — |
| `JWT_REFRESH_SECRET` | Firma de refresh tokens | — |
| `JWT_ACCESS_EXPIRATION` | Duración access token | `1h` |
| `JWT_REFRESH_EXPIRATION` | Duración refresh token | `7d` |
| `CORS_ORIGIN` | Orígenes permitidos (separados por coma) | Vacío = todos |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | — |
| `CLOUDINARY_API_KEY` | Cloudinary API key | — |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | — |
| `SEED_FORCE_IMAGES` | Re-subir imágenes al seed | `0` |

### Frontend (`frontend/.env`)

| Variable | Descripción | Default |
|---|---|---|
| `VITE_BACKEND_API_URL` | URL del backend API | `http://localhost:4000` |

## 🔧 Scripts disponibles

### Backend

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor con nodemon (hot reload) |
| `npm start` | Iniciar servidor en producción |
| `npm run seed` | Cargar datos de demo |
| `npm run migrate` | Ejecutar migraciones pendientes |
| `npm run hash-passwords` | Hashear contraseñas existentes |

### Frontend

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualizar build |

---

Desarrollado por Francis Esculpi
