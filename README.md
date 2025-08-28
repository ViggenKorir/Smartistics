# Smartistics 

## The Cross‑Channel ROI Optimizer for Africa

> *Cut the guesswork. Discover which platforms actually bring customers to your African business.*

Smartistics is a SaaS analytics and optimization platform that unifies ad data from Google Ads, Meta (Facebook/Instagram), LinkedIn, TikTok (and more), then **calculates ROI/ROAS, recommends budget reallocation, and automates reporting**. It’s built for African markets (mobile‑first, multi‑currency, bandwidth‑friendly) and ships with **n8n workflows** for self‑sustaining data syncs, alerts, billing, and backups.

---

## Table of Contents

* [Features](#features)
* [Architecture](#architecture)
* [Tech Stack](#tech-stack)
* [Monorepo Structure](#monorepo-structure)
* [Prerequisites](#prerequisites)
* [Quick Start (Docker)](#quick-start-docker)
* [Manual Setup (Dev)](#manual-setup-dev)
* [Environment Variables](#environment-variables)
* [n8n Automation Workflows](#n8n-automation-workflows)
* [Data Model (Essentials)](#data-model-essentials)
* [Using Animated Icons & Video](#using-animated-icons--video)
* [Development Tips](#development-tips)
* [Security & Compliance](#security--compliance)
* [Deploying to Production](#deploying-to-production)
* [Roadmap](#roadmap)
* [License](#license)

---

## Features

* **Unified dashboards**: Spend, revenue, ROAS, CAC, impressions, clicks, conversions per platform & campaign.
* **AI‑assisted optimization**: Budget reallocation recommendations with projected impact.
* **Attribution models**: First/last touch, linear; easy to extend to data‑driven.
* **Automated reporting**: Weekly/monthly PDFs or slides sent to Slack/Email.
* **Alerts**: CPA/ROAS thresholds, anomalies, channel degradation.
* **Multi‑currency**: ZAR/NGN/KES/GHS + base currency conversions.
* **Bandwidth‑friendly**: `.webm` hero video, animated SVG/Lottie icons.

---

## Architecture

```
+-------------------+        +------------------+        +-------------------+
|  Frontend (Next)  | <----> |  API (Node/Nest) | <----> |  PostgreSQL (DB)  |
|  React + TS       |        |  REST/GraphQL    |        |  Prisma/TypeORM   |
+---------^---------+        +--------^---------+        +---------^---------+
          |                           |                            |
          |                           |                            |
          v                           v                            v
     Lottie/SVG                  n8n Workflows                  Redis (cache)
(icons/animations)       (ingest, clean, compute, alerts,  billing, backups)
```

---

## Tech Stack

* **Frontend:** Next.js (App Router) + React + TypeScript, TailwindCSS, Recharts
* **Backend:** Node.js (NestJS or Express), TypeScript, Prisma ORM
* **DB/Cache:** PostgreSQL, Redis
* **Automation:** n8n (Docker)
* **Auth:** NextAuth (OAuth/JWT) or custom OAuth2 for ad APIs
* **Payments:** Stripe Billing
* **Observability:** Sentry (errors), Prometheus + Grafana (metrics)

---

## Monorepo Structure

```
smartistics/
├─ apps/
│  ├─ web/            # Next.js (client + server components)
│  └─ api/            # NestJS (or Express) REST/GraphQL API
├─ packages/
│  ├─ ui/             # Shared UI components (TS, Tailwind)
│  └─ config/         # ESLint, TS configs, env loaders
├─ infra/
│  ├─ docker/         # docker-compose, Dockerfiles
│  └─ n8n/            # workflow JSONs (ingest/report/alerts)
└─ prisma/            # schema.prisma, migrations, seed
```

---

## Prerequisites

* **Node.js** ≥ 18, **pnpm** or **npm**
* **Docker** + **Docker Compose** (recommended for quick start)
* Accounts & API credentials for: **Google Ads**, **Meta**, **LinkedIn**, **TikTok**
* **Stripe** account (for subscriptions)

---

## Quick Start (Docker)

> One command to spin up **web**, **api**, **db (Postgres)**, **redis**, and **n8n**.

1. **Clone & enter**

```bash
git clone https://github.com/your-org/smartistics.git
cd smartistics
```

2. **Create env files** (copy examples below into the respective paths)

```
.env
apps/web/.env.local
apps/api/.env
```

3. **Run**

```bash
docker compose -f infra/docker/docker-compose.yml up --build
```

4. **Open**

* Web (Next.js): [http://localhost:3000](http://localhost:3000)
* API (Nest/Express): [http://localhost:4000](http://localhost:4000)
* n8n: [http://localhost:5678](http://localhost:5678)
* Postgres: localhost:5432 (user/pass per .env)

### Sample `docker-compose.yml`

```yaml
version: "3.9"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports: ["5432:5432"]
    volumes:
      - db_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports: ["6379:6379"]

  api:
    build: ../../apps/api
    env_file: ../../apps/api/.env
    depends_on: [db, redis]
    ports: ["4000:4000"]

  web:
    build: ../../apps/web
    env_file: ../../apps/web/.env.local
    depends_on: [api]
    ports: ["3000:3000"]

  n8n:
    image: n8nio/n8n:latest
    env_file: ../../.env
    ports: ["5678:5678"]
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on: [api, db]

volumes:
  db_data:
  n8n_data:
```

---

## Manual Setup (Dev)

### 1) Install deps

```bash
pnpm install
```

### 2) Start Postgres & Redis (local)

* Postgres (Docker): `docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=smartistics -d postgres:15`
* Redis (Docker): `docker run -p 6379:6379 -d redis:7`

### 3) Backend (API)

```bash
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

API runs on `http://localhost:4000`.

### 4) Frontend (Web)

```bash
cd apps/web
pnpm dev
```

Web runs on `http://localhost:3000`.

> **Next.js App Router Note**: Any component using hooks must start with the directive:

```tsx
"use client";
```

---

## Environment Variables

Create these files:

### Root `.env`

```
# Postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=smartistics
DATABASE_URL=postgresql://postgres:postgres@db:5432/smartistics

# Redis
REDIS_URL=redis://redis:6379

# n8n
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=change-me
N8N_ENCRYPTION_KEY=generate_a_long_random_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### `apps/api/.env`

```
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smartistics
REDIS_URL=redis://localhost:6379
JWT_SECRET=replace-with-strong-secret

# Ad APIs (placeholders)
GOOGLE_ADS_CLIENT_ID=...
GOOGLE_ADS_CLIENT_SECRET=...
GOOGLE_ADS_REFRESH_TOKEN=...
META_APP_ID=...
META_APP_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
TIKTOK_CLIENT_ID=...
TIKTOK_CLIENT_SECRET=...
```

### `apps/web/.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=replace-with-strong-secret
NEXTAUTH_URL=http://localhost:3000
STRIPE_PUBLIC_KEY=pk_test_...
```

---

## n8n Automation Workflows

**Deploy n8n** (Docker) then log in at `http://localhost:5678`.

### 1) Ad Data Ingestion (Daily 06:00)

* **Cron** → **HTTP Request** (Google Ads) → **Function** (normalize) → **Postgres** (insert) → Repeat for Meta/LinkedIn/TikTok
* Schema normalization target:

  ```json
  {
    "platform": "google_ads",
    "campaign_id": "123",
    "date": "2025-08-28",
    "spend": 2100.50,
    "impressions": 67000,
    "clicks": 1340,
    "conversions": 94,
    "revenue": 7350.00,
    "currency": "ZAR"
  }
  ```

### 2) ROI & Budget Reallocator

* **Cron** (hourly) → **Postgres** (aggregate last 7/30d) → **Function** (compute ROAS, CAC; run simple mean‑variance/heuristic budget shift) → **Postgres** (write recommendations) → **Slack** (summary)

### 3) Alerts

* **Cron** (every 30m) → **Postgres** (threshold queries) → **IF** (ROAS < target or CPA > target) → **Slack/Email** → **Webhook** (notify API for banner alerts)

### 4) Reporting

* **Cron** (weekly) → **Postgres** (aggregate) → **Function** (HTML → PDF) → **Email** (attach PDF) or **Slack** (upload file)

### 5) Billing & Access

* **Stripe Trigger** (webhook) → **n8n Webhook** → **Function** (map event) → **Postgres** (update subscription) → **Email** (receipt)

### 6) Backups

* **Cron** (daily) → **Execute Command** (`pg_dump`) → **S3 Upload** → **Slack** (backup status)

> You can export/import these as JSON within n8n for version control (store in `infra/n8n/`).

---

## Data Model (Essentials)

Prisma excerpt (`prisma/schema.prisma`):

```prisma
model PlatformAccount {
  id            String   @id @default(cuid())
  userId        String
  provider      String   // google_ads | meta | linkedin | tiktok
  accessToken   String?
  refreshToken  String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model MetricDaily {
  id           String   @id @default(cuid())
  date         DateTime
  platform     String
  campaignId   String
  spend        Float
  impressions  Int
  clicks       Int
  conversions  Int
  revenue      Float
  currency     String @default("ZAR")
}

model Recommendation {
  id           String   @id @default(cuid())
  date         DateTime @default(now())
  platform     String
  currentShare Float    // % of total budget
  suggestedShare Float
  projectedImpact Float // +/‑ currency units
}
```

---

## Using Animated Icons & Video

### Lottie (animated icons)

* Install: `pnpm add lottie-react`
* Use:

  ```tsx
  "use client";
  import { Player } from "@lottiefiles/react-lottie-player";

  export default function HeroIcons() {
    return (
      <Player src="/animations/analytics.json" autoplay loop style={{ height: 80 }} />
    );
  }
  ```

> Sources: **LottieFiles** (free/paid), **Lordicon** (animated packs).

### Animated `.webm` (hero video)

```tsx
<video
  className="w-full h-auto"
  autoPlay
  loop
  muted
  playsInline
  poster="/video/poster.jpg"
>
  <source src="/video/hero.webm" type="video/webm" />
  <source src="/video/hero.mp4" type="video/mp4" />
</video>
```

---

## Development Tips

* **App Router & Hooks**: Client components must start with `"use client";`.
* **Type‑safety**: End‑to‑end types with TypeScript + Zod (request validation).
* **Testing**: Vitest/Jest + Playwright for E2E.
* **Seeding**: `pnpm prisma db seed` populates demo campaigns & metrics.

---

## Security & Compliance

* Use **HTTPS** everywhere (Let’s Encrypt/ACM).
* Store secrets in **Doppler/Vault/Parameter Store** (never in git).
* Principle of least privilege for ad APIs and DB.
* GDPR/POPIA: data export/delete endpoints, DPA with vendors, region pinning.

---

## Deploying to Production

* **Frontend**: Vercel
* **API**: Fly.io/Render/AWS ECS
* **DB**: Neon/Supabase (managed Postgres)
* **n8n**: Docker on a small VM (e.g., Lightsail/Droplet) with HTTPS & basic auth
* **Observability**: Sentry DSN + Grafana dashboard

### Minimal checklist

* [ ] Custom domain + SSL
* [ ] Env vars set in all platforms
* [ ] DB migrations applied
* [ ] Stripe webhooks configured to n8n → API
* [ ] Cron schedules (n8n) enabled

---

## Roadmap

* Data‑driven attribution (Shapley/Markov)
* MMM (lightweight Bayesian model for channel contribution)
* Auto‑pause/boost budgets by rule
* Partner integrations (HubSpot/Salesforce, GA4)

---

## License

Choose your license (MIT/Apache‑2.0/Proprietary). Update `LICENSE` accordingly.
