# Kyro Platform

Plataforma de **Kyro**, empresa de desarrollo de software. Este repositorio contiene dos cosas en una sola app Next.js:

- **Sitio público** (`/`): landing comercial que muestra los productos activos de Kyro (leídos desde la base de datos) y sirve como portafolio.
- **Panel de administración** (`/admin`): CRM ligero, protegido con login, para gestionar clientes, productos, suscripciones y pagos de los sistemas que Kyro vende.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Prisma](https://www.prisma.io/) + PostgreSQL
- [NextAuth](https://next-auth.js.org/) (credenciales, sesión JWT)
- Tailwind CSS
- Recharts (estadísticas), React Leaflet (mapa de clientes)
- Deploy: [Railway](https://railway.app/)

## Estructura

```
app/
  page.tsx              # Landing pública
  admin/                 # Panel de administración (rutas protegidas)
  api/                    # API routes (clientes, productos, suscripciones, pagos, auth)
  api/public/products/    # API pública consumida por la landing
components/               # Componentes compartidos (admin y públicos)
lib/                       # Prisma client, configuración de NextAuth
prisma/
  schema.prisma            # Modelo de datos
  migrations/                # Historial de migraciones (ver nota abajo)
scripts/                    # Scripts de seed y mantenimiento de datos
```

## Requisitos previos

- Node.js 18+
- PostgreSQL (local vía Docker o una instancia remota, p. ej. Railway)

## Configuración local

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia las variables de entorno de ejemplo y complétalas:
   ```bash
   cp .env.example .env.local
   ```
3. (Opcional) Levanta un PostgreSQL local con Docker:
   ```bash
   docker compose up -d
   ```
4. Aplica el esquema a tu base de datos y genera el cliente de Prisma:
   ```bash
   npx prisma migrate deploy   # aplica las migraciones existentes
   npx prisma generate
   ```
5. (Opcional) Crea datos de ejemplo:
   ```bash
   npm run db:seed
   ```
6. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | `prisma generate` + build de producción |
| `npm run start` | Servidor de producción (tras `build`) |
| `npm run db:push` | Sincroniza el esquema directamente sin generar migración (solo para prototipado rápido) |
| `npm run db:generate` | Regenera el cliente de Prisma |
| `npm run db:seed` | Corre `scripts/seed.js` |

## Migraciones de Prisma

El proyecto ahora versiona el esquema con **Prisma Migrate** (`prisma/migrations/`) en vez de depender solo de `db push`. Se generó una migración baseline (`.../migrations/<timestamp>_init/migration.sql`) que refleja el esquema actual de `schema.prisma`.

**Importante — paso único antes de volver a desplegar:** como la base de datos de producción ya existe con estas tablas, la primera vez hay que decirle a Prisma que esa migración baseline ya está aplicada, sin volver a ejecutar el SQL (evita errores de "la tabla ya existe"):

```bash
npx prisma migrate resolve --applied 20260906173407_init
```

Corre ese comando una sola vez apuntando a la base de datos real (con `DATABASE_URL` de producción). De ahí en adelante, los cambios de esquema se hacen así:

```bash
npx prisma migrate dev --name describe_el_cambio   # en local, crea y aplica la migración
npx prisma migrate deploy                            # en producción/CI
```

## Pendientes conocidos

- **Seguridad:** `scripts/seed-admin.js` crea un usuario admin con contraseña hardcodeada en el código (`admin123`). Debe generarse desde una variable de entorno y no dejar contraseñas en el repo. Además, `lib/auth.ts` valida contra `ADMIN_PASSWORD_HASH`, pero conviene confirmar que esa variable (y no `ADMIN_PASSWORD`) esté definida correctamente en Railway.
- **Landing/portafolio:** el botón "Probar Demo" de cada producto compara el nombre por texto (`wabot`, `smartpath`) en vez de usar el campo `demoUrl` del producto — no escala al agregar productos nuevos. El formulario de contacto no envía datos a ningún backend todavía. Los planes de precios están fijos y no reflejan `basePriceMonthly` real.
- **Testing:** todavía no hay pruebas automatizadas ni CI configurado.

## Productos de Kyro (para referencia del equipo)

- **Wabot** — agendamiento de citas para negocios (chat de cliente, panel admin, panel de profesional, estadísticas).
- **ERP Inventarios** — ventas + inventario + proveedores + pedidos + menú, para restaurantes o tiendas, con estadísticas por producto y evolución del negocio.
- **Sistema de Gestión Empresarial (DECS, Aruba)** — sistema integral para una empresa de construcción/eléctrica: usuarios, control horario, proyectos, nómina, inventario, flota, chat, reportes.

Todos soportan multi-negocio y venta por suscripción o precio único.
