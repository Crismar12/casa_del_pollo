# 🍗 La Casa de Pollo - Gestor de Pedidos

Sistema de gestión de pedidos para restaurante desarrollado con React, TypeScript y Supabase.

## 📋 Descripción

Aplicación web moderna para la gestión integral de pedidos de restaurante, que incluye funcionalidades de administración, catálogo de productos, carrito de compras y seguimiento de órdenes.

## ✨ Características

- 🔐 **Autenticación de usuarios** con Supabase
- 🛒 **Carrito de compras** con gestión de productos
- 📦 **Gestión de pedidos** en tiempo real
- 👨‍💼 **Panel de administración** completo
- 📱 **Diseño responsive** para móviles y tablets
- 📊 **Visualización de datos** con gráficos (Recharts)
- 🎨 **UI moderna** con Tailwind CSS y Headless UI

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.2** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Redux Toolkit** - Gestión de estado
- **Tailwind CSS** - Estilos utilitarios
- **Headless UI** - Componentes accesibles
- **Heroicons & Lucide React** - Iconografía
- **Recharts** - Visualización de datos
- **Supabase** - Backend as a Service

### Backend
- **Node.js** con **Express**
- **TypeScript**
- **Supabase** - Base de datos y autenticación
- **CORS** - Configuración de seguridad

## 📁 Estructura del Proyecto

```
la-casa-de-pollo-gestor-pedidos/
├── src/
│   ├── features/          # Características por módulo
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── products/
│   ├── pages/             # Páginas de la aplicación
│   ├── shared/            # Componentes y utilidades compartidas
│   ├── store/             # Configuración de Redux
│   ├── routes/            # Configuración de rutas
│   └── config/            # Configuraciones generales
├── backend/               # API backend
│   └── src/
├──db.sql                 # script de la base de datos
└── public/               # Archivos estáticos

```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Instalación Frontend

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Vista previa del build
npm run preview

# Ejecutar linter
npm run lint
```

### Instalación Backend

```bash
cd backend

# Instalar dependencias
npm install

# Modo desarrollo
npm run dev
```

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_SUPABASE_URL=https://ytuzhqypnfkcptetvadl.supabase.co
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_BACKEND_API_URL=http://localhost:4000
SUPABASE_URL=https://ytuzhqypnfkcptetvadl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SUPABASE_ANON_KEY=tu_supabase_anon_key
PORT=4000
```

Para el backend, también existe el archivo [`backend/.env.example`](backend/.env.example). La forma recomendada de usarlo es copiarlo a [`backend/.env`](backend/.env) y completar la `SUPABASE_SERVICE_ROLE_KEY`:

```powershell
Copy-Item backend\.env.example backend\.env
```

Si prefieres hacerlo a mano, asegúrate de que el backend tenga al menos estas variables:

```env
SUPABASE_URL=https://ytuzhqypnfkcptetvadl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
PORT=4000
```

## ▶️ Cómo levantar la app

1. Instala dependencias en la raíz:

```bash
npm install
```

2. Instala dependencias del backend:

```bash
cd backend
npm install
```

3. Crea el archivo de entorno del backend desde el ejemplo:

```powershell
Copy-Item backend\.env.example backend\.env
```

4. Inicia el backend:

```bash
cd backend
npm run dev
```

5. En otra terminal, inicia el frontend:

```bash
npm run dev
```

## 📝 Notas Importantes

- El frontend usa las variables `VITE_*` del `.env` raíz.
- El backend no debe usar la `SERVICE_ROLE_KEY` en variables `VITE_*`.
- Si cambias el `.env`, reinicia el proceso correspondiente para que cargue los valores nuevos.

## 📄 Scripts Disponibles

### Frontend
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run preview` - Vista previa del build de producción
- `npm run lint` - Ejecuta el linter de ESLint

### Backend
- `npm run dev` - Inicia el servidor backend con nodemon

## 🎯 Páginas Principales

- **Login** - Autenticación de usuarios
- **Productos** - Catálogo de productos disponibles
- **Carrito** - Gestión del carrito de compras
- **Pedidos** - Historial y seguimiento de órdenes
- **Admin** - Panel de administración

## 🔧 Tecnologías de Desarrollo

- ESLint - Linting de código
- TypeScript ESLint - Reglas específicas para TypeScript
- PostCSS - Procesamiento de CSS
- Autoprefixer - Prefijos automáticos de CSS

---

Desarrollado con ❤️ 
