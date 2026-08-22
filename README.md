# Job Board

> 🚧 **Work in Progress** — actively under development.

A modern, SEO-first job board platform for publishing job offers, public competitions, internships, and career opportunities, with a private admin dashboard and AI-assisted job importing.

The project is designed around three goals: **fast job discovery, strong search-engine visibility, and efficient content management**.

## ✨ Highlights

### Public job platform

- Fast job listing and detail pages
- Search, filters, pagination, categories, and locations
- Similar jobs and direct application links
- SEO-friendly category and location pages

### SEO-first architecture

- Next.js App Router
- Incremental Static Regeneration (ISR)
- Automatic `sitemap.xml` and `robots.txt`
- JSON-LD structured data for job postings and breadcrumbs
- Canonical URLs and Open Graph metadata
- Semantic internal navigation for long-tail SEO

### Admin dashboard

- Protected admin area
- Job, company, category, and location management
- Draft → published → closed workflow
- Featured jobs
- Content management designed for fast publishing

### AI-assisted job importing

- Import a job directly from a URL
- Extracts article content automatically
- Falls back to full-page extraction when necessary
- Uses an LLM to transform unstructured job content into structured data
- Imported jobs are prepared as drafts for admin review before publication

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16, App Router, Turbopack |
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL 16 |
| ORM | Prisma 6 |
| Authentication | Secure password hashing + signed session cookie |
| AI | OpenRouter LLM integration |
| Development | Docker, ESLint, Prettier, Git |
| Deployment | Vercel + managed PostgreSQL |

## 🧱 Architecture

The application follows a modular Next.js architecture with clear separation between presentation, domain logic, database access, SEO utilities, administration, and AI import functionality.

```text
app/           → routes and pages
components/    → reusable UI components
lib/           → business logic, auth, AI, database and SEO utilities
prisma/        → database schema and migrations
docs/          → project documentation
public/        → static assets
```

## 🔐 Security

The admin area is protected by authenticated sessions and server-side authorization checks. Sensitive configuration is provided through environment variables and is never intended to be committed to the repository.

## 🚀 Local Development

### Prerequisites

- Node.js 20+
- Docker
- npm

### Installation

```bash
npm install
```

Start PostgreSQL and configure the environment:

```bash
docker compose up -d
cp .env.example .env.local
```

Generate the Prisma client, apply migrations, and seed sample data:

```bash
npm run db:generate
npm run db:deploy
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` for the public application and `http://localhost:3000/admin` for the admin dashboard.

## 🔧 Environment Variables

The application uses environment variables for database access, admin authentication, the public site URL, and the optional AI importer configuration.

See `.env.example` for the required variables and setup details.

## 📈 Current Status

The core MVP is implemented and the project is being actively refined.

Current development priorities include:

- Improving the user experience and visual polish
- Expanding SEO and content features
- Refining the admin workflow
- Improving AI-assisted importing and content validation
- Production readiness and deployment
- Adding screenshots and a public demo

## 🗺️ Roadmap

- **Phase 1 — MVP:** public job platform, search, categories, locations, and admin CRUD
- **Phase 2 — SEO growth:** internal linking, related jobs, and improved discovery
- **Phase 3 — Monetization:** advertising and sponsored/featured jobs
- **Phase 4 — Automation:** AI-assisted publishing and workflow automation

See [`ROADMAP.md`](ROADMAP.md) and [`TASKS.md`](TASKS.md) for project planning.

## 📸 Screenshots

Screenshots and a public demo will be added once the current development phase is completed.

## 📄 License

This project is currently unlicensed and is intended as a personal development and portfolio project during the current development phase.
