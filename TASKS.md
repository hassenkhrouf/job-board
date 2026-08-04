# TASKS.md

# Current Development Status

Project Status:

🟡 MVP Development

---

# Current Phase

Phase 1 — MVP Development

Status:

In Progress

---

# Development Order

## Task 1

Initialize project.

Status:

Completed

Notes:

- Next.js App Router + TypeScript + Tailwind CSS
- Route group: app/(public)/
- Empty placeholder folders removed (create when needed)
- Minimal root metadata (title only)
- Dependencies: next, react, react-dom only (+ standard tooling)

---

## Task 2

Configure development environment.

Status:

Completed

Notes:

- Git repository initialized
- .env.example (DATABASE_URL, ADMIN_SECRET, NEXT_PUBLIC_SITE_URL)
- Prettier + format script
- metadataBase wired to NEXT_PUBLIC_SITE_URL when set
- .gitignore allows .env.example

---

## Task 3

Create database schema.

Status:

Completed

Notes:

- prisma/schema.prisma designed
- UUID primary keys (@default(uuid()) @db.Uuid)
- Enums: JobStatus, EmploymentType
- Job: excerpt, featured, sourceName, sourceUrl
- VarChar limits on short fields; Text for description
- Indexes: status, featured, categoryId, locationId, companyId, deadline
- onDelete: Restrict, onUpdate: Cascade
- Models: Job, Company, Category, Location, Admin

---

## Task 4

Setup Prisma.

Status:

Completed

Notes:

- prisma@6.19.3 + @prisma/client@6.19.3 (Prisma 7 skipped — requires adapters)
- Client singleton: lib/database/prisma.ts
- Initial migration: prisma/migrations/20260801160000_init
- Scripts: db:generate, db:migrate, db:deploy
- Prisma Studio not used
- Apply migration when DATABASE_URL points to a real database

---

## Task 5

Create Homepage.

Status:

Completed

Notes:

- Public layout with Header + Footer
- Homepage: Hero, SearchBar (GET form), Latest Jobs / Categories / Locations empty states, AdPlaceholder
- UI primitives: Container, Section, Card (no Button/Badge yet)
- Layout only — no business logic, no fake jobs
- next/link for navigation; no next/image

---

## Task 6

Create Header.

Status:

Completed

Notes:

- Implemented during Task 5 as components/layout/Header.tsx
- No further changes unless a real requirement appears

---

## Task 7

Create Footer.

Status:

Completed

Notes:

- Implemented during Task 5 as components/layout/Footer.tsx
- No further changes unless a real requirement appears

---

## Task 8

Create Jobs Listing Page.

Status:

Completed

Notes:

- /jobs page structure + SEO metadata (title, description, canonical, OG, Twitter)
- JobCard, JobList (empty state), JobsPagination (ready, hidden when ≤1 page)
- Badge component for category/location
- SearchBar reused with defaultValues for future filters
- No fake jobs; pagination/filter architecture in place

---

## Task 9

Create Job Details Page.

Status:

Completed

Notes:

- Route: /jobs/[slug] (Server Component)
- getJobBySlug via Prisma (PUBLISHED only); notFound() when missing
- Dynamic metadata: title, description, canonical, Open Graph, Twitter
- Schema.org JobPosting JSON-LD
- JobDetailView + SimilarJobs (omitted when empty)
- No fake jobs; no client fetching

---

## Task 10

Create Categories.

Status:

Completed

Notes:

- Dynamic route: /jobs/category/[slug]
- getCategoryBySlug + getPublishedJobs (shared with /jobs)
- JobsListingLayout reuses JobList, SearchBar, JobsPagination
- SEO metadata + notFound() for unknown slugs
- Empty state via JobList; pagination architecture reused

---

## Task 11

Create Locations.

Status:

Completed

Notes:

- Dynamic route: /jobs/location/[slug]
- getLocationBySlug + getPublishedJobs (published only)
- Reuses JobsListingLayout / JobList / SearchBar / JobsPagination
- SEO: title, description, canonical, Open Graph, Twitter
- Header/Footer: removed broken /categories and /locations links

---

## Task 12

Implement Search.

Status:

Completed

Notes:

- URL query params only (q, category, location, page); SSR via getPublishedJobs
- Dirty/empty params redirect to clean URLs
- Dynamic SEO + h1 from active filters
- SearchBar options from DB; filters preserved in pagination
- Shared search-params + jobs-listing-seo helpers

---

## Task 13

Create Admin Dashboard (simplified per project decision: no dashboard/widgets/stats — the admin area is content-management only).

Scope delivered:
- `/admin/login` — server-rendered login form posting to `loginAdmin`; French error messages from `?error=config|credentials`.
- `/admin` — server redirect to `/admin/jobs` (no UI, no dashboard homepage).
- `/admin/jobs` — the admin landing; read-only table of all jobs (every status, newest first) with columns Title · Company · Category · Status · Created At · Actions. Actions are placeholders pending Task 14 (CRUD).
- Auth kept exactly as designed: HMAC-signed session cookie, scrypt password verify, `middleware.ts` protects `/admin` (allows `/admin/login`). Removed orphan `lib/admin/session.ts` (zero references; superseded by `constants.ts`/`create-session.ts`/`verify-session.ts`). `.env.example` documents `ADMIN_PASSWORD_HASH`.
- All server-side, no client components, no client state.

Status:

Completed

---

## Task 14

CRUD Jobs.

Status:

Completed

Notes:

- Full Create / Update / Delete for jobs, server-side only, no client components, no client state.
- `/admin/jobs` — landing table now wires real Actions: title links to edit; per-row Modifier / Supprimer links; "Créer une offre" button; success banner via `?created|updated|deleted=1`.
- `/admin/jobs/new` — create form (server-rendered) posting to `createJob`.
- `/admin/jobs/[id]/edit` — edit form, pre-filled, posting to `updateJob.bind(null, id)`; `notFound()` if the job is missing.
- `/admin/jobs/[id]/delete` — explicit confirmation page (no inline JS confirm); POST to `deleteJob`. Hard delete (`prisma.job.delete`), idempotent on missing rows, redirect back to `/admin/jobs?deleted=1`.
- Shared `components/admin/JobForm.tsx` reused by create and edit; native HTML controls (`<input>`, `<select>`, `<textarea>`, `<input type="date">`, checkbox); no form libraries.
- Fields exposed (per decision): title, company, category, location, description, applicationUrl, employmentType, status, featured, deadline. Not exposed: id, slug, createdAt/updatedAt, publishedAt.
- Slug: generated from title (`slugify`, accent-stripped); uniqueness enforced with `-2`, `-3` suffixes. On edit, slug regenerates only if the title changed AND the job is not currently PUBLISHED (don't break a live URL); otherwise kept.
- `publishedAt` set automatically on the first transition to `PUBLISHED`.
- Server-side validation in `lib/admin/job-form-schema.ts` (no third-party lib); on validation failure, redirect back to the form with `?invalid=<comma-list>`, decoded into per-field error stubs for re-render. No client-side state.
- Defense-in-depth: write actions (`createJob`/`updateJob`/`deleteJob`) re-verify the admin session cookie via `requireAdminSession()` before mutating (middleware only guards page navigation).
- Cache refreshed via `revalidatePath` after every mutation (admin + public routes).
- `AdminJobRow.status` tightened from `string` to the `JobStatus` enum (caught during the pre-CRUD architecture review). `jobStatusLabels` map added to `lib/admin/constants.ts`.

---

## Task 15

SEO Optimization.

Status:

Completed

Notes:

- Homepage sections wired to real data (Latest Jobs, Featured Jobs, Categories, Locations) with `getHomepageData` snapshot + `revalidate=300`.
- `app/sitemap.ts` (ISR, includes job/category/location URLs) and `app/robots.ts` (`/admin` disallowed).
- `/categories` and `/locations` SEO hub pages added (top-N categories/locations with published job counts).
- Breadcrumbs UI (`components/ui/Breadcrumbs.tsx`) + BreadcrumbList JSON-LD on jobs listing, category, location and job detail pages.
- Search results (`?q=`) marked `noindex, follow` via `jobs-listing-seo`.
- URL helpers `lib/seo/site-url.ts` (siteUrl / absoluteUrl) used for canonical/OG/JSON-LD URLs.
- Global `not-found.tsx`, `error.tsx`, `loading.tsx` added.

---

## Task 16

Add Sitemap.

Status:

Completed

Notes:

- `app/sitemap.ts` with static entries (home, /jobs, /categories, /locations) + dynamic job/category/location URLs from the DB; `export const revalidate = 300`.

---

## Task 17

Add robots.txt.

Status:

Completed

Notes:

- `app/robots.ts`: allow all, disallow `/admin`, sitemap pointer to `${siteUrl}/sitemap.xml`.

---

## Task 18

Add Structured Data.

Status:

Completed

Notes:

- JobPosting JSON-LD on `/jobs/[slug]` (via `lib/seo/job-posting-json-ld.ts`, absolute URLs).
- BreadcrumbList JSON-LD via `components/seo/JsonLd.tsx` + `lib/seo/breadcrumb-json-ld.ts`.

---

## Task 19

Reference Data CRUD (Companies, Categories, Locations).

Status:

Completed

Notes:

- Admin routes: `/admin/companies`, `/admin/categories`, `/admin/locations` (list / new / edit / delete).
- Server actions in `lib/admin/reference-actions.ts` (requireAdminSession, unique slug, P2003 in-use guard, revalidate public + admin).
- Shared config + reads in `lib/admin/references.ts`; validation + form state in `lib/admin/reference-form-schema.ts`.
- Client forms use `useActionState` (values preserved, per-field French errors); lists show job counts.
- This unblocks job creation on a fresh database.

---

## Task 20

Admin form UX + jobs area polish.

Status:

Completed

Notes:

- JobForm converted to client `useActionState`: on validation failure the server action returns per-field errors + submitted values (no more generic "Champ invalide", values no longer lost).
- Added `excerpt` field (300 chars) to JobForm and to create/update actions; edit form pre-fills it.
- Styled admin inputs/buttons/cards/tables/Badges; admin nav (Offres · Entreprises · Catégories · Lieux); login page restyled.
- Removed the `?invalid=` redirect flow; `decodeInvalidFields` kept as a utility.
- Shared `requireAdminSession` extracted to `lib/admin/require-session.ts`; shared revalidation in `lib/admin/revalidate.ts`.

---

## Task 21

Seed data.

Status:

Completed

Notes:

- `prisma/seed.ts` + `npm run db:seed` (tsx). Idempotent upserts for 8 companies, 8 categories, 8 locations; 8 sample jobs (incl. one public COMPETITION and one DRAFT).
- `package.json` `prisma.seed` config added for `prisma db seed`.

---

## Task 22

Advertisement Integration.

Status:

Pending

---

## Task 23

Production Deployment.

Status:

Pending

---

## Task 24

AI Job Import (URL importer, real OpenRouter provider).

Status:

Completed

Notes:

- Generic import framework under `lib/imports/` (`types`, `shared`, `draft`, `registry`, `url/`). New source types (PDF, plain text, DOCX, RSS) register an importer in `lib/imports/registry.ts` without changing the rest of the flow.
- AI kept isolated under `lib/ai/` (`types`, `prompts/job-import`, `extractors/readable`, `providers/openrouter`).
- `@extractus/article-extractor` added for generic Readability-style content extraction (no per-site selectors; works for KeeJob, TanitJobs, LinkedIn, company career pages…).
- Extraction never happens client-side: `importJobFromUrl` server action fetches, extracts, and runs the provider.
- `lib/ai/providers/openrouter.ts` is a real OpenRouter implementation (`extractJobFromAI`, single public function). Reads `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` (default `inclusionai/ling-3.0-flash:free`) from env. OpenAI-compatible Chat Completions, temperature 0, JSON response mode with plain-text fallback, 30s timeout, one retry on transient failures, typed `ImportError` for non-ok responses and invalid/empty JSON. Prompt built once in `lib/ai/prompts/job-import.ts`.
- Imported job is stored in a short-lived server-side draft (`lib/imports/draft.ts`), not in the URL. `importJobFromUrl` stashes it and redirects to `/admin/jobs/new?imported=1`.
- `/admin/jobs/new` reuses the existing `JobForm`, prefilled from the draft (company/category/location matched by name; employment type/deadline normalized). Admin reviews then publishes.
- Added optional `sourceUrl` hidden field to `JobForm`; on create the job persists `sourceUrl`, derived `sourceName`, and `importedAt` (new nullable column, migration `add_imported_at`). Edit preserves these fields.
- `.env.example` documents `OPENROUTER_API_KEY`.

---

## Task 25

AI Import extraction quality: multi-stage pipeline + Markdown + richer prompt.

Status:

Completed

Notes:

- Multi-stage extraction in `lib/ai/extractors/readable.ts`: Stage 1 downloads the full HTML (own fetch with browser UA, timeout), Stage 2 runs the Readability-style article extractor on that HTML (`extractFromHtml`), Stage 3 evaluates the result and falls back to the cleaned full page when the article is too short, drops headings, or the fallback is clearly richer (`fallbackRicher`). The LLM therefore receives the whole posting instead of a truncated excerpt.
- HTML cleaning in `lib/ai/extractors/html.ts` (via `linkedom`, added as a direct dependency): removes only obvious noise — script/style/svg/iframe/canvas/noscript/template/audio/video/nav/footer and cookie-consent / ad containers (id/class hints + `data-ad` attributes). Keeps headings, paragraphs, tables, lists, links, `aside` (where job boards put contract type / salary / education / experience), definition lists, blockquotes.
- Markdown conversion in `lib/ai/extractors/markdown.ts` (via `node-html-markdown`, added as a direct dependency): preserves headings, lists and tables. Images/media ignored to keep output compact.
- Title resolution: article title, else the first `<h1>` in the cleaned page (cleaner than the `<title>` tag, which is noisy on job boards), else the document title.
- Prompt improved in `lib/ai/prompts/job-import.ts`: the AI must keep the COMPLETE description (missions, requirements, skills, experience, education, number of positions, salary, benefits, schedule) instead of summarizing, and extract title/company/location/category/employmentType/deadline/applicationUrl/featured/sourceUrl/sourceName — null only when a value truly does not exist. The OpenRouter provider was NOT modified (response contract unchanged).
- Debug mode: `lib/ai/debug.ts` gates logging behind `IMPORT_DEBUG=1` (documented in `.env.example`). When set, the server console prints the extracted content, the final prompt and the AI JSON response. No effect on production.
- Verified with `tsc`, `lint`, `build`, plus live imports: KeeJob (structured sidebar now captured — salary/contract/education/experience end up in the description) and a Greenhouse career page (full 21k-char posting). TanitJobs returns HTTP 403 to datacenter fetch (bot protection, not an extraction issue).

---

# Rules

The AI must complete only ONE task at a time.

Never start a new task until the previous one is completed and verified.

Always update this file after completing a task.

Never mark a task as completed without verification.

Always explain what changed before moving to the next task.

When all Phase 1 tasks are complete, wait for user approval before starting Phase 2.