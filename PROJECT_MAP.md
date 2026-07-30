# PROJECT_MAP — OFPPT Platforme

## TECH_STACK
| Layer | Technology | Location |
|-------|-----------|----------|
| Frontend Framework | Next.js 16.2.6 (App Router) | `./` |
| UI Library | React 19.2.4 + shadcn/ui + Framer Motion | `./src/` |
| Language | TypeScript 5 (strict) | — |
| Styling | Tailwind CSS 4 | — |
| Backend | NestJS 11 | `./backend/` |
| ORM | Prisma 6.19.3 + MySQL | `./backend/prisma/` |
| Search | Meilisearch (Cloud or local) | via backend |
| Storage | Supabase Storage (or local uploads) | via backend |
| State | Zustand | `./src/stores/` |
| Data Fetching | TanStack Query | `./src/hooks/` |
| Auth | JWT (NestJS) + Zustand store (frontend) | `backend/src/auth/` |
| Icons | Lucide React | — |
| PDF View | Browser iframe (native PDF viewer) | — |
| Ads | Google AdSense (optional) | — |

## ARCHITECTURE

```
┌─────────────────────┐     HTTP/JSON      ┌──────────────────────┐
│   Frontend (Next.js) │ ←───────────────→ │   Backend (NestJS)    │
│   Vercel             │                    │   Railway / VPS      │
└─────────────────────┘                    └──────────────────────┘
                                                     │
                                                     ▼
                                            ┌──────────────────┐
                                            │   MySQL Database   │
                                            │   (PlanetScale)    │
                                            └──────────────────┘
                                                     │
                                                     ▼
                                            ┌──────────────────┐
                                            │ Meilisearch Cloud │
                                            └──────────────────┘
```

## FRONTEND STRUCTURE

```
src/
├── app/
│   ├── (marketing)/         # Home, About, Contact, Privacy, Terms
│   │   ├── page.tsx         # Homepage (Hero + Popular + Latest + Categories)
│   │   ├── about/
│   │   ├── contact/
│   │   ├── privacy/
│   │   └── terms/
│   ├── (browse)/            # Filter wizard + Search
│   │   ├── filtrer/page.tsx  # 4-step filter wizard
│   │   └── search/page.tsx   # Search results with filters
│   ├── documents/[slug]/    # Document viewer page
│   ├── admin/               # Admin dashboard (login + CRUD)
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── sitemap.xml/route.ts
├── components/
│   ├── ui/                  # Button, Card, Badge, Input, Select, Skeleton
│   ├── layout/              # Header (sticky, backdrop-blur), Footer
│   ├── home/                # HeroSection, PopularSection, LatestSection, CategoriesSection
│   ├── filter-wizard/       # FilterWizard (4 steps with Framer Motion)
│   ├── document/            # DocumentCard
│   └── providers/           # QueryProvider (TanStack Query)
├── features/
│   └── admin/               # AdminDashboard (documents, filieres, levels, categories tabs)
├── stores/
│   ├── filter-store.ts      # Zustand: filter wizard state
│   └── auth-store.ts        # Zustand: admin JWT auth
├── hooks/
│   └── use-documents.ts     # TanStack Query hooks
├── lib/
│   ├── utils.ts             # cn(), formatFileSize(), formatDate(), slugify()
│   ├── api.ts               # API client (get, post, put, delete, upload)
│   └── logger.ts            # Async structured logger
└── config/
    └── site.ts              # Site metadata config
```

## BACKEND STRUCTURE

```
backend/
├── prisma/
│   ├── schema.prisma        # 6 models: Admin, Level, Filiere, Module, Category, Document
│   └── seed.ts              # 16 filières, ~185 modules, 3 levels, 7 categories, 1 admin
├── src/
│   ├── main.ts              # NestJS bootstrap (CORS, validation, /api prefix)
│   ├── app.module.ts        # Root module
│   ├── prisma/              # PrismaService (singleton)
│   ├── auth/                # JWT auth (login, JwtStrategy)
│   ├── documents/           # CRUD + view/download counters + popular/latest
│   ├── filieres/            # CRUD + modules included
│   ├── levels/              # CRUD
│   ├── categories/          # CRUD
│   ├── search/              # Meilisearch sync + search
│   └── common/              # slugify utility
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## ROUTES (Frontend)
| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Homepage (Hero + Popular + Latest + Categories) |
| `/filtrer` | Static | 4-step filter wizard (Niveau → Filière → Module → Type) |
| `/search?q=...` | Static | Search results with filters |
| `/documents/[slug]` | Dynamic | Document viewer + download + related |
| `/admin` | Static | Admin dashboard (auth + CRUD) |
| `/privacy` | Static | Privacy Policy |
| `/terms` | Static | Terms of Use |
| `/contact` | Static | Contact form |
| `/about` | Static | About page |
| `/sitemap.xml` | Static | Dynamic XML sitemap |

## API ROUTES (Backend — NestJS)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Admin login (JWT) |
| GET | `/api/documents` | — | List with filters + pagination |
| GET | `/api/documents/popular` | — | Popular documents |
| GET | `/api/documents/latest` | — | Latest documents |
| GET | `/api/documents/:slug` | — | Single document |
| GET | `/api/documents/:slug/related` | — | Related documents |
| POST | `/api/documents` | JWT | Upload document |
| PUT | `/api/documents/:id` | JWT | Update document |
| DELETE | `/api/documents/:id` | JWT | Delete document |
| POST | `/api/documents/:id/view` | — | Increment view count |
| POST | `/api/documents/:id/download` | — | Increment download count |
| GET | `/api/filieres` | — | List filières |
| GET | `/api/filieres/:slug` | — | Filière with modules |
| POST | `/api/filieres` | JWT | Create filière |
| PUT | `/api/filieres/:id` | JWT | Update filière |
| DELETE | `/api/filieres/:id` | JWT | Delete filière |
| GET | `/api/levels` | — | List levels |
| POST | `/api/levels` | JWT | Create level |
| DELETE | `/api/levels/:id` | JWT | Delete level |
| GET | `/api/categories` | — | List categories |
| POST | `/api/categories` | JWT | Create category |
| DELETE | `/api/categories/:id` | JWT | Delete category |
| GET | `/api/search?q=...` | — | Meilisearch full-text search |
| POST | `/api/search/sync` | JWT | Sync all docs to Meilisearch |

## ORPHANS & PENDING
| Item | Status | Notes |
|------|--------|-------|
| NestJS backend setup | PENDING | Run `npm install` in backend/, configure MySQL |
| MySQL database | PENDING | Create database or connect to PlanetScale |
| Meilisearch setup | PENDING | Create Meilisearch Cloud account or local binary |
| Supabase Storage | PENDING | Configure bucket + service role key |
| Sample PDF files | PENDING | Upload via admin after backend is running |
| Rate limiting | PENDING | Add to NestJS API routes |
| Docker compose | SKIPPED | User excluded Docker |
| Pagination on search | PENDING | Add load more / page navigation |
| Unit tests | PENDING | Add Jest tests for backend + frontend |
