# TechStore — Frontend

E-commerce moderno construido con React + TypeScript + Tailwind CSS.

## Stack

| Tecnología | Uso |
|---|---|
| React 18 | UI library |
| TypeScript | Tipado estático |
| Vite 5 | Bundler + dev server |
| Tailwind CSS 3 | Estilos utility-first |
| React Router DOM v6 | Enrutamiento |
| Axios | HTTP client con interceptores |
| Zustand | Estado global del carrito |
| Context API | AuthContext + ThemeContext |
| React Hook Form + Zod | Formularios con validación |
| react-hot-toast | Notificaciones |
| Lucide React | Iconos |

## Estructura de carpetas

```
src/
├── assets/              # Imágenes, íconos estáticos
├── components/
│   ├── ui/              # Botones, inputs, skeletons, badges, estados vacíos
│   ├── layout/          # Navbar, Footer, AppLayout
│   ├── product/         # ProductCard, ProductGrid, ProductDetail
│   ├── cart/            # CartItem, CartSummary
│   └── auth/            # Formularios de login/register
├── contexts/
│   ├── AuthContext.tsx  # JWT, sesión, login/logout
│   ├── ThemeContext.tsx # Dark mode
│   └── cartStore.ts     # Zustand store del carrito
├── hooks/
│   ├── useProducts.ts   # useProducts, useFeaturedProducts, useProduct, useProductSearch
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── axios.ts         # Instancia Axios con interceptores
│   └── utils.ts         # Helpers: cn, formatPrice, extractErrorMessage...
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductPage.tsx
│   ├── CartPage.tsx
│   ├── ProfilePage.tsx
│   └── NotFoundPage.tsx
├── routes/
│   ├── AppRouter.tsx    # Configuración central de rutas
│   └── ProtectedRoute.tsx
├── services/
│   ├── authService.ts
│   ├── productService.ts
│   └── cartService.ts
├── types/
│   └── index.ts         # Todos los tipos TypeScript
├── index.css            # Tailwind + utilidades globales
└── main.tsx             # Entry point
```

## Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
cp .env.example .env.local
# Editar VITE_API_URL con la URL de tu backend

# 3. Dev server (puerto 3000)
npm run dev

# 4. Build para producción
npm run build
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base del backend | `/api` o `https://api.tudominio.com/api` |

## Rutas de la aplicación

| Ruta | Página | Protegida |
|---|---|---|
| `/home` | HomePage | No |
| `/products` | ProductsPage | No |
| `/products/:id` | ProductPage | No |
| `/login` | LoginPage | Solo sin auth |
| `/register` | RegisterPage | Solo sin auth |
| `/cart` | CartPage | Sí (auth) |
| `/profile` | ProfilePage | Sí (auth) |

## Dark mode

El dark mode se activa con la clase `.dark` en el elemento `<html>`.
El ThemeContext lo gestiona automáticamente y persiste la preferencia en localStorage.

## Próximos módulos (escalabilidad)

- `/admin` — Panel administrador con CRUD de productos
- `/orders` — Sistema de órdenes
- `/checkout` — Flujo de pago
- `/categories/:slug` — Catálogo por categoría