# PLAN DE IMPLEMENTACIÓN: Migración a Producción

## Estado del Proyecto

- **Hosting:** Vercel (frontend) + Vercel/Render (backend) + Neon.tech (BD)
- **BD:** Ya tiene cuenta y DATABASE_URL, db.sql ejecutado en Neon
- **Usuarios demo:** Admin + vendedor
- **Rama actual:** feat/security-auth
- **Commits en feat/neon_db:** Migración de Supabase a Neon.tech completada
- **Estructura:** Frontend en `frontend/`, Backend en `backend/` (separados para deployment)

## Estructura de Ramas

```
main
└── dev
    ├── feat/neon_db                    ← Ya existente (migración a Neon)
    ├── feat/security-auth              ← FASE 1: Seguridad completa
    ├── feat/product-crud               ← FASE 2: CRUD Productos + Categorías
    ├── feat/admin-dashboard-v2         ← FASE 3: Dashboard mejorado + demo
    ├── feat/ui-improvements            ← FASE 4: Modo oscuro, skeleton loaders, empty states
    ├── feat/advanced-features          ← FASE 5: PDF, filtros avanzados, accesibilidad
    └── feat/backend-polish             ← FASE 6: Zod, error handling, logging
```

---

## FASE 0: Merge de feat/neon_db → dev

**Rama:** `feat/neon_db` (ya creada)
**Acción:** Merge a `dev` para tener la base limpia

```
git checkout dev
git merge feat/neon_db
```

---

## FASE 1: `feat/security-auth` — Seguridad completa

**¿Qué hace?** Implementa autenticación y seguridad real. Sin esto, el proyecto NO puede ir a producción.

### Commits planificados:
1. `feat: agregar bcrypt para hash de contraseñas`
2. `feat: implementar JWT con access y refresh tokens`
3. `feat: crear middleware de autenticación`
4. `feat: crear middleware de autorización por roles`
5. `feat: configurar CORS restricciones por origen`
6. `feat: agregar rate limiting diferenciado`
7. `feat: instalar helmet para headers de seguridad`
8. `feat: eliminar console.log de credenciales en producción`
9. `feat: actualizar login y register con JWT en frontend`

### Tecnologías nuevas:
| Paquete | Qué hace | Por qué lo uso |
|---|---|---|
| `bcrypt` + `@types/bcrypt` | Hashea contraseñas con salt | Nunca guardar contraseñas en texto plano. bcrypt es el estándar de la industria |
| `jsonwebtoken` + `@types/jsonwebtoken` | Genera y verifica tokens JWT | Permite autenticar al usuario sin guardar sesión en el servidor |
| `helmet` | Agrega headers de seguridad HTTP (CSP, X-Frame-Options, etc.) | Protege contra XSS, clickjacking, y otros ataques comunes |
| `express-rate-limit` | Limita peticiones por IP | Previene fuerza bruta en login y abuso de la API |

### Cómo funciona JWT:
```
1. Usuario hace login → servidor genera access token (15 min) + refresh token (7 días)
2. Frontend guarda ambos tokens en localStorage (o httpOnly cookie)
3. Cada petición al backend incluye el access token en el header: Authorization: Bearer <token>
4. El middleware verifica que el token sea válido antes de permitir el acceso
5. Cuando el access token expira (15 min), el frontend usa el refresh token para obtener uno nuevo
6. Si el refresh token también expira, el usuario debe hacer login de nuevo
```

### Por qué no solo guardar el usuario en localStorage como ahora:
Porque actualmente CUALQUIERA puede abrir la consola del navegador, escribir
`localStorage.setItem('usuario', '{"id":1,"rol":"admin"}')`, y hacerse pasar por admin.
Con JWT, el token tiene una firma criptográfica que el servidor verifica. Si alguien lo
modifica, el servidor lo rechaza.

### Cómo funciona el Rate Limiting:
```
- Login: máximo 5 intentos por minuto por IP → si alguien intenta adivinar contraseñas, se bloquea
- API general: 100 peticiones por minuto → previene abuso
- Creación de pedidos: 10 por minuto → previene spam
```

### Archivos a crear/modificar:
- `backend/src/middleware/auth.ts` — middleware de JWT
- `backend/src/middleware/authorize.ts` — middleware de roles
- `backend/src/middleware/rateLimiter.ts` — configuración de rate limiting
- `backend/src/config/cors.ts` — configuración de CORS
- `backend/src/services/auth.service.ts` — agregar bcrypt + JWT
- `backend/src/controllers/auth.controller.ts` — retornar tokens
- `backend/src/index.ts` — agregar helmet, rate limiting, CORS
- `backend/package.json` — nuevas dependencias
- `frontend/src/shared/hooks/useAuth.ts` — manejar tokens
- `frontend/src/features/auth/services/auth.service.ts` — enviar/recibir tokens
- `frontend/src/routes/PrivateRoutes.tsx` — verificar token

---

## FASE 2: `feat/product-crud` — CRUD Productos y Categorías

**¿Qué hace?** El admin puede crear, editar y eliminar productos y categorías desde el panel.

### Commits planificados:
1. `feat: agregar endpoints CRUD de productos (POST, PUT, DELETE)`
2. `feat: agregar endpoints CRUD de categorías`
3. `feat: crear componente ProductForm para crear/editar`
4. `feat: crear componente CategoryForm para crear/editar`
5. `feat: agregar página de administración de productos`
6. `feat: agregar página de administración de categorías`
7. `feat: implementar subida de imágenes con Cloudinary`

### Tecnologías nuevas:
| Paquete | Qué hace | Por qué lo uso |
|---|---|---|
| `cloudinary` + `@types/cloudinary` | Almacenamiento de imágenes en la nube | Las imágenes de productos no se guardan en el servidor, se suben a Cloudinary (gratis hasta 25k imágenes/mes) |

### Por qué Cloudinary y no subir archivos directo:
Porque Vercel (donde hostearás el frontend) y Render/Railway (donde hostearás el backend)
son serverless — no tienen disco persistente. Si subes una imagen al servidor, se pierde
alrededor. Cloudinary es el estándar para imágenes en apps serverless.

### Archivos a crear/modificar:
- `backend/src/controllers/product.controller.ts` — agregar POST, PUT, DELETE
- `backend/src/controllers/category.controller.ts` — agregar POST, PUT, DELETE
- `backend/src/repositories/product.repository.ts` — queries de escritura
- `backend/src/repositories/category.repository.ts` — queries de escritura
- `backend/src/routes/product.routes.ts` — agregar rutas protegidas
- `backend/src/routes/category.routes.ts` — agregar rutas protegidas
- `frontend/src/features/products/components/ProductForm.tsx` — formulario de producto
- `frontend/src/features/admin/components/AdminProducts.tsx` — tabla de productos con acciones
- `frontend/src/features/admin/components/AdminCategories.tsx` — tabla de categorías
- `frontend/src/pages/AdminPage.tsx` — agregar pestañas de gestión

---

## FASE 3: `feat/admin-dashboard-v2` — Dashboard mejorado + Demo

**¿Qué hace?** Dashboard con métricas reales, datos de demo pre-cargados, y experiencia de usuario pulida.

### Commits planificados:
1. `feat: agregar script de seed con datos de demo`
2. `feat: crear endpoint para cargar datos de demo`
3. `feat: agregar métricas avanzadas (tiempo prep, comparativa semanal)`
4. `feat: mejorar gráficos del dashboard con tooltips y animaciones`
5. `feat: crear componente DemoBanner con botón de reset`
6. `feat: agregar exportación de pedidos a PDF`

### Tecnologías nuevas:
| Paquete | Qué hace | Por qué lo uso |
|---|---|---|
| `jspdf` + `jspdf-autotable` | Genera PDFs desde JavaScript | Exportar pedidos como PDF para impresión. Es inesperado y los reclutadores lo notan |
| `@faker-js/faker` | Genera datos fake realistas | Para el script de seed: genera nombres, emails, teléfonos realistas |

### Qué datos tiene la demo:
```sql
-- Seed incluye:
-- 3 usuarios: 1 admin, 1 vendedor
-- 5 categorías: Pollo, Bebidas, Acompañamientos, Postres, Promociones
-- 12 productos: Pollo entero, alitas, etc. con imágenes reales
-- 20 pedidos de ejemplo con diferentes estados
-- 10 clientes de ejemplo
```

### Archivos a crear/modificar:
- `backend/src/seed.ts` — script de seed con faker
- `backend/src/controllers/adminDashboard.controller.ts` — métricas nuevas
- `backend/src/repositories/adminDashboard.repository.ts` — queries optimizadas
- `frontend/src/features/admin/components/DemoBanner.tsx` — banner de demo
- `frontend/src/features/admin/components/ExportOrderPdf.tsx` — botón de exportar PDF
- `db.sql` — agregar función SQL para métricas

---

## FASE 4: `feat/ui-improvements` — Mejoras de UI/UX

**¿Qué hace?** La aplicación se ve profesional y pulida. Modo oscuro, skeleton loaders, empty states diseñados.

### Commits planificados:
1. `feat: implementar modo oscuro con Tailwind y Context`
2. `feat: crear componente DarkModeToggle`
3. `feat: crear componente SkeletonLoader reutilizable`
4. `feat: crear componente EmptyState con ilustración y CTA`
5. `feat: agregar splash screen animado`
6. `feat: agregar transiciones y animaciones a componentes`
7. `feat: mejorar accesibilidad (a11y) con aria-labels y roles`

### Cómo funciona el modo oscuro:
```
1. DarkModeContext guarda el tema en localStorage
2. Agrega/quita la clase "dark" en el <html>
3. Tailwind detecta la clase "dark" y aplica los estilos dark:*
4. Cada componente tiene variantes oscuras: bg-white dark:bg-gray-800
```

### Archivos a crear/modificar:
- `frontend/src/shared/context/ThemeContext.tsx` — contexto del tema
- `frontend/src/shared/components/iu/DarkModeToggle.tsx` — botón toggle
- `frontend/src/shared/components/iu/SkeletonLoader.tsx` — skeleton reutilizable
- `frontend/src/shared/components/iu/EmptyState.tsx` — empty state con ilustración
- `frontend/src/shared/components/layout/SplashScreen.tsx` — pantalla de carga
- `frontend/tailwind.config.js` — habilitar darkMode
- `frontend/src/App.tsx` — envolver con ThemeProvider
- Todos los componentes — agregar dark: variants

---

## FASE 5: `feat/advanced-features` — Features diferenciadoras

**¿Qué hace?** Funcionalidades que nadie tiene en sus portafolios.

### Commits planificados:
1. `feat: agregar filtros avanzados de pedidos (fecha, precio, estado)`
2. `feat: crear componente OrderFilters`
3. `feat: agregar lazy loading de imágenes`
4. `feat: implementar optimistic updates en pedidos`
5. `feat: agregar página 404 personalizada con ilustración`
6. `feat: mejorar loading states con skeleton loaders`
7. `feat: agregar soporte WCAG 2.1 AA (contraste, focus, aria)`

### Archivos a crear/modificar:
- `frontend/src/features/orders/components/OrderFilters.tsx` — filtros avanzados
- `frontend/src/shared/components/iu/SkeletonLoader.tsx` — reutilizar de FASE 4
- `frontend/src/pages/NotFoundPage.tsx` — rediseñar con ilustración
- `frontend/src/routes/AppRouter.tsx` — lazy loading de páginas
- `frontend/src/routes/PrivateRoutes.tsx` — verificar token con refresh
- `frontend/src/shared/utils/apiClient.ts` — manejo de optimistic updates

---

## FASE 6: `feat/backend-polish` — Pulido del backend

**¿Qué hace?** El backend se ve profesional y escalable.

### Commits planificados:
1. `feat: instalar y configurar Zod para validación de inputs`
2. `feat: crear schemas de validación para cada endpoint`
3. `feat: crear middleware de error handling centralizado`
4. `feat: instalar y configurar pino para logging estructurado`
5. `feat: reemplazar console.log por pino en todo el backend`
6. `feat: agregar migraciones de DB numeradas`
7. `feat: optimizar queries N+1 en adminDashboard.repository`

### Tecnologías nuevas:
| Paquete | Qué hace | Por qué lo uso |
|---|---|---|
| `zod` | Validación de schemas con TypeScript | En lugar de validar manualmente `if (!req.body.nombre)`, defines un schema y Zod valida todo automáticamente |
| `pino` + `pino-pretty` | Logging estructurado y formateado | Los logs se ven bonitos en desarrollo y son parseables en producción (útil para debugging) |

### Cómo funciona Zod:
```typescript
// En lugar de hacer esto:
if (!req.body.nombre) return res.status(400).json({ error: 'nombre requerido' });
if (typeof req.body.nombre !== 'string') return res.status(400).json({ error: 'nombre debe ser string' });
if (req.body.nombre.length < 2) return res.status(400).json({ error: 'nombre muy corto' });

// Haces esto:
const ProductSchema = z.object({
  nombre: z.string().min(2).max(100),
  precio: z.number().positive(),
  descripcion: z.string().optional(),
});

// En el controller:
const parsed = ProductSchema.safeParse(req.body);
if (!parsed.success) {
  return res.status(400).json({ errors: parsed.error.issues });
}
```

### Archivos a crear/modificar:
- `backend/src/schemas/product.schema.ts` — schema de productos
- `backend/src/schemas/category.schema.ts` — schema de categorías
- `backend/src/schemas/order.schema.ts` — schema de pedidos
- `backend/src/schemas/auth.schema.ts` — schema de auth
- `backend/src/middleware/errorHandler.ts` — middleware centralizado
- `backend/src/middleware/validate.ts` — middleware de validación con Zod
- `backend/src/config/logger.ts` — configuración de pino
- `backend/migrations/` — carpeta de migraciones
- Todos los controllers — reemplazar validación manual por Zod
- Todos los archivos — reemplazar console.log por logger

---

## Orden de ejecución

```
1. Merge feat/neon_db → dev
2. Crear feat/security-auth desde dev → merge a dev
3. Crear feat/product-crud desde dev → merge a dev
4. Crear feat/admin-dashboard-v2 desde dev → merge a dev
5. Crear feat/ui-improvements desde dev → merge a dev
6. Crear feat/advanced-features desde dev → merge a dev
7. Crear feat/backend-polish desde dev → merge a dev
8. Merge dev → main
```

---

## Preguntas pendientes

- [ ] Confirmar plan completo antes de empezar
- [ ] Ejecutar db.sql en Neon.tech
- [ ] Configurar cuenta de Cloudinary (si se usa en FASE 2)
