# NAAKSH — Next.js 16 Production Storefront

Official Next.js 16 App Router storefront for **NAAKSH®** — Premium Pakistani Streetwear.

---

## 🌟 Architecture Overview

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Styling:** Tailwind CSS + PostCSS
- **State & Storage:** Centralized UUID-authoritative Cart & Wishlist (`src/lib/cart.js`, `src/lib/wishlist.js`)
- **API Integration:** Centralized isomorphic API client (`src/lib/api.js`) consuming Laravel Backend M16/M17 REST endpoints
- **SEO & Microdata:** Dynamic OpenGraph metadata, Schema.org JSON-LD (`Organization`, `WebSite`, `Product`), dynamic `/sitemap.xml` and `/robots.txt`

---

## 🛠️ Environment Variables

Create `.env.local` or configure your hosting platform environment:

| Variable | Required | Description | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** | Authoritative Backend REST API base URL (must include `/api`) | `https://backend.naakshofficial.com/api` |
| `NEXT_PUBLIC_SERVER_URL` | No | Fallback alias for backend base URL | `https://backend.naakshofficial.com/api` |

---

## 🚀 Development & Build Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (with Turbopack)
npm run dev

# 3. Run ESLint code quality audit
npm run lint

# 4. Generate dynamic sitemap from Laravel API
npm run generate:sitemap

# 5. Create optimized production build
npm run build

# 6. Start production server
npm start
```

---

## 🗺️ Dynamic Sitemap Generation

Generate or update the static XML sitemap from the authoritative live Laravel catalog API:

```bash
npm run generate:sitemap
```

### Features & Behavior:
- **Authoritative Endpoints**: Consumes `GET /api/categories` and `GET /api/products`.
- **Multi-Page Pagination**: Automatically paginates through all catalog products with `per_page=48` (strictly respecting backend limit `<= 48`) until `current_page >= last_page`.
- **Output File**: Generates `Website/public/sitemap.xml`.
- **Failure-Safe Preservation**: If the Laravel API is offline or returns an error, the existing `public/sitemap.xml` is preserved intact, a failure message is logged, and the process exits with code 1.
- **URL Deduplication**: Deterministic Set/Map-based deduplication preventing repeated entries.
- **Private Route Exclusions**: Strictly omits `/cart`, `/checkout`, `/wishlist`, `/account`, `/api/*`, and admin routes.
- **Canonical Domain**: All `<loc>` tags use canonical `https://naakshofficial.com`.


---

## 🌐 Routes & Pages

| Route | Type | Description |
|---|---|---|
| `/` | Static (ISR 1m) | Homepage with hero drop, Eid sale banners, and featured collections |
| `/shop` | Dynamic (SSR) | Full catalog with category filters, search, and sorting |
| `/category/[slug]` | Dynamic (SSR) | Category collection pages with dynamic SEO |
| `/product/[slug]` | Dynamic (SSR) | Product detail with gallery, size/color selectors, and Schema.org markup |
| `/cart` | Static (Client Hydrated) | Dynamic shopping cart with line item quantities and subtotal |
| `/checkout` | Static (Client Hydrated) | Direct checkout with Pakistan city dropdowns & M17 backend integration |
| `/checkout/success` | Static | Confirmed order summary and delivery estimates |
| `/wishlist` | Static (Client Hydrated) | Stored wishlist items with backend UUID rehydration |
| `/about` | Static | Brand story and mission statement |
| `/contact` | Static | Customer care channels and `POST /api/contact` message form |
| `/privacy` | Static | Privacy policy |
| `/terms` | Static | Terms of service |
| `/sitemap.xml` | Dynamic XML | Auto-generated sitemap of static and catalog routes |
| `/robots.txt` | Static | Crawler instructions allowing public pages and blocking private sessions |

---

## 🔒 Security & Performance Features

- **Security Headers:** `X-Frame-Options`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Referrer-Policy`, and `Permissions-Policy` configured in `next.config.mjs`.
- **Image Optimization:** WebP/AVIF format transcoding with remote domain whitelisting.
- **Server Authority:** Zero client-side price calculation trust. Backend evaluates and authorizes all checkouts.
- **Error Boundaries:** Custom branded `error.jsx`, `not-found.jsx`, and skeleton `loading.jsx` for all active routes.

---

## 🚢 Deployment Guide

### Option 1: Vercel (Recommended)
1. Import repository into Vercel dashboard.
2. Framework Preset: **Next.js**.
3. Root Directory: `Website`.
4. Configure environment variable: `NEXT_PUBLIC_API_URL=https://backend.naakshofficial.com/api`.
5. Deploy.

### Option 2: Node.js / PM2 on Linux VPS
```bash
cd /var/www/naaksh/Website
npm ci
npm run build
pm2 start npm --name "naaksh-web" -- start -- -p 3000
```
