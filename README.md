# Job Board

A lightweight, SEO-first job board platform for publishing job offers, public
competitions, internships, and career opportunities. Built to generate organic
traffic, stay fast on every device, and monetize through advertising.

The platform pairs a fast, index-friendly public site with a private admin area
(including an AI-powered importer that turns any job URL into a structured,
ready-to-review posting).

## Features

**SEO-first public site**

- Server-rendered pages with Incremental Static Regeneration (5-min revalidation)
- Auto-generated `sitemap.xml` and `robots.txt`
- JSON-LD structured data (`JobPosting`, `BreadcrumbList`)
- Semantic breadcrumbs, canonical URLs, meta & Open Graph tags

**Job discovery**

- Homepage with hero, featured jobs, latest jobs, categories and locations
- Job listings with full-text search, filters, and pagination
- Job detail pages with similar jobs and direct apply links
- Category and location hub pages for long-tail SEO

**Admin panel** (`/admin`)

- Password-protected login (scrypt password hash + HMAC-signed session cookie)
- Full CRUD for jobs, companies, categories, and locations
- Draft → published workflow with `DRAFT`, `PUBLISHED`, `CLOSED` statuses
- Featured jobs support

**AI job import**

- Import any job from a URL, no site-specific scrapers
- Multi-stage extraction: Readability article extractor, then automatic
  fallback to the full page converted to Markdown when content is incomplete
- OpenRouter LLM provider builds a structured job that prefills the existing
  form for admin review
- Optional dev-only debug mode (`IMPORT_DEBUG=1`)

## Tech Stack

| Layer       | Technology                                                        |
| ----------- | ----------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack) + React 19                     |
| Language    | TypeScript                                                         |
| Styling     | Tailwind CSS v4                                                    |
| Database    | PostgreSQL 16 (Docker) + Prisma 6                                  |
| SEO         | `sitemap.ts` / `robots.ts`, JSON-LD, ISR                           |
| Auth        | scrypt password hash + HMAC-signed session cookie                  |
| AI import   | OpenRouter, `@extractus/article-extractor`, `node-html-markdown`, `linkedom` |
| Tooling     | ESLint, Prettier                                                   |

## Screenshots

> Screenshots will be added here once available.

```
public/screenshots/home.png
public/screenshots/jobs-listing.png
public/screenshots/job-detail.png
public/screenshots/admin-jobs.png
public/screenshots/admin-import.png
```

## Installation

**Prerequisites**

- Node.js 20+ (tested on 22)
- Docker (for the local PostgreSQL database)
- npm

**1. Install dependencies**

```sh
npm install
```

**2. Start PostgreSQL and configure the environment**

```sh
docker compose up -d
cp .env.example .env.local   # then fill in the values
```

The local Docker Postgres listens on port `5433`:

```
postgresql://jobboard:jobboard@localhost:5433/jobboard?schema=public
```

**3. Apply migrations and seed sample data**

> Note: the Prisma CLI does not read `.env.local`. Export `DATABASE_URL` or
> pass it inline for the Prisma commands below.

```sh
npm run db:generate
npm run db:deploy
npm run db:seed
```

## Environment Variables

| Variable               | Required | Description                                                        |
| ---------------------- | -------- | ------------------------------------------------------------------ |
| `DATABASE_URL`         | ✅        | PostgreSQL connection string.                                      |
| `ADMIN_SECRET`         | ✅        | Secret used to sign the admin session cookie.                      |
| `ADMIN_PASSWORD_HASH`  | ✅        | Admin login password hash (scrypt, `saltHex:hashHex`).             |
| `NEXT_PUBLIC_SITE_URL` | ✅        | Public site URL (canonical / OG absolute URLs).                    |
| `OPENROUTER_API_KEY`   | import   | API key for the AI job importer (OpenRouter).                      |
| `OPENROUTER_MODEL`     |          | OpenRouter model id (default: `inclusionai/ling-3.0-flash:free`).  |
| `IMPORT_DEBUG`         |          | Set to `1` to log extracted content, prompt, and AI response.      |

See `.env.example` for the full template with inline comments.

## Local Development

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site and
[http://localhost:3000/admin](http://localhost:3000/admin) for the admin area.
See `docs/DEVELOPMENT_GUIDE.md` for generating the admin password hash.

## Build

```sh
npm run build     # production build
npm run start     # run the production build (default http://localhost:3000)
```

## Deployment

The app is a standard Next.js application and deploys to any platform that
supports it (e.g. Vercel) plus a managed PostgreSQL database (e.g. Supabase,
Neon, or RDS).

1. Provision a PostgreSQL database and set `DATABASE_URL` plus the other
   environment variables listed above.
2. Run `npm run db:deploy` against the production database to apply migrations.
3. Deploy the app and serve it over HTTPS (required for the secure session
   cookie in production).

See `docs/DEPLOYMENT.md` for details.

## Project Structure

```
job-board/
├── app/                     # Next.js App Router routes
│   ├── (public)/            # public site (home, jobs, categories, locations)
│   ├── admin/               # admin area (login + panel)
│   └── sitemap.ts, robots.ts
├── components/              # reusable UI components
│   ├── admin/               # admin forms, tables, import form
│   ├── home/                # homepage sections
│   ├── jobs/                # job cards, listing, detail, similar jobs
│   ├── layout/              # header / footer
│   ├── seo/                 # JSON-LD helpers
│   └── ui/                  # shared primitives (buttons, cards, badges)
├── lib/
│   ├── admin/               # admin auth, actions, queries
│   ├── ai/                  # extraction, prompts, AI provider (isolated)
│   ├── database/            # Prisma client
│   ├── imports/             # generic import framework (draft, registry, url)
│   ├── jobs/                # public queries (job, category, location hubs)
│   ├── seo/                 # site URL, breadcrumb & posting JSON-LD
│   └── utils/
├── prisma/
│   └── schema.prisma        # database schema & migrations
├── public/                  # static assets
├── docs/                    # project documentation
├── proxy.ts                 # edge middleware (admin session guard)
└── docker-compose.yml       # local PostgreSQL
```

## Roadmap

- **Phase 1 — MVP** *(done)*: homepage, job listings & detail, categories,
  locations, search, admin content management.
- **Phase 2 — SEO growth**: better filtering, related jobs, internal linking.
- **Phase 3 — Monetization**: AdSense integration, sponsored & featured jobs,
  featured companies.
- **Phase 4 — Automation**: automatic job importing, AI content processing,
  email notifications.

See `ROADMAP.md` and `TASKS.md` for details.

## License

This project is currently **unlicensed** (all rights reserved). Before
publishing publicly, choose a license and add a `LICENSE` file — for example,
the MIT License for an open-source project.
