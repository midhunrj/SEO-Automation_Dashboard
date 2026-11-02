# SEO Automation Dashboard — Full-Stack Technical Assessment

> **Applicant:** Midhunraj R  
> **Role:** AI Developer & Automation Engineer  
> **Organization:** EdgeLink Technology  
> **Stack:** Next.js 14 (App Router) + Node.js + BullMQ + Anthropic Claude API + Prisma (PostgreSQL) + Upstash Redis  

---

## 🚀 Overview & Objective

This application is an end-to-end **SEO Automation Dashboard** built to streamline website SEO audits for local businesses (healthcare, dental clinics, real estate) across India. It features:

1. **Headless Crawler Engine**: Fast Fetch + Cheerio DOM parser analyzing titles, meta descriptions, canonicals, H1-H3 hierarchy, image alt tags, word counts, and links.
2. **Schema & Technical Validation**: JSON-LD and Microdata entity validator alongside robots.txt and sitemap.xml crawler.
3. **Multi-Source Signal Aggregator**: Pluggable crawlers with a toggle switch (`USE_MOCKS=true`) for Google PageSpeed Insights, Google Search Console, and DataForSEO SERP rankings.
4. **BullMQ Asynchronous Job Queue**: Reliable background queue (`seo-audit-jobs`) running on Upstash Redis with retry backoff and real-time step progress tracking.
5. **Anthropic Claude AI Engine**: Implements the official **Master SEO Audit Prompt** delivering prioritised, falsifiable recommendations in strict JSON.
6. **Executive PDF Report Generator**: Compiles downloadable branded reports with score breakdowns and actionable fixes.
7. **Twilio WhatsApp Delivery**: Dispatches audit completion alerts and report links directly to client numbers.
8. **Dual-Portal UI**: 
   - **Internal Admin Portal (`/`)**: Queue audits, observe live 10-step BullMQ pipeline progress, and manage client histories.
   - **Client-Facing Dashboard (`/client/[id]`)**: Interactive executive report with health score gauges, quick wins (<2 hrs), and filterable recommendation matrices.

---

## 🛠 Technology Stack

| Layer | Component | Technology |
|---|---|---|
| **Presentation** | Admin Portal | Next.js 14 App Router + Tailwind CSS |
| **Presentation** | Client Dashboard | Next.js 14 App Router + Tailwind CSS + Interactive Filters |
| **Application** | Audit Job Runner | BullMQ + Redis (`seo-audit-jobs` queue) |
| **Application** | Headless Crawler | Fetch + Cheerio (Serverless-compatible) |
| **Application** | AI Analysis Engine | Anthropic Claude API (`claude-3-5-sonnet`) with Master Prompt |
| **Application** | Report Generator | Puppeteer PDF / PDF-Lib fallback |
| **Data Layer** | Database & ORM | PostgreSQL (Supabase / Neon) via Prisma ORM |
| **Job Queue** | Cache / Queue | Upstash Redis (Serverless) |
| **Integrations** | Mocks & External APIs | PageSpeed Insights, GSC, DataForSEO, Twilio WhatsApp |

---

## 🔄 Audit Job Pipeline Flow

Every audit strictly follows the 10-step sequence specified in Section 3.2:

```text
TRIGGER (Manual Admin Form Submission / Scheduled Cron)
     │
     ▼
BullMQ QUEUE: seo-audit-jobs [Upstash Redis]
     │
     ▼
WORKER picks up job [Node.js Worker / Runner]
     ├── Step 1: Fetch + Cheerio crawls URL & extracts DOM
     ├── Step 2: Google PageSpeed Insights (Core Web Vitals) [MOCKED]
     ├── Step 3: Google Search Console (Clicks, Impressions, CTR) [MOCKED]
     ├── Step 4: Schema.org validator (LocalBusiness JSON-LD)
     ├── Step 5: On-Page signal analysis (H1s, Meta, Images, Links)
     ├── Step 6: robots.txt + sitemap.xml validation
     └── Step 7: DataForSEO localized keyword rank positions [MOCKED]
     │
     ▼
Claude AI Engine: Evaluates signals using Master Prompt -> Structured JSON
     │
     ▼
Prisma ORM: Persists audit record in Supabase / Neon PostgreSQL
     │
     ▼
Report Generator: Compiles executive PDF report
     │
     ▼
Twilio WhatsApp: Logs delivery payload and report link
```

---

## 📁 Project Structure

```text
seo-automation-dashboard/
├── app/
│   ├── api/
│   │   ├── audit/
│   │   │   ├── route.js          # POST (queue audit) & GET (list audits)
│   │   │   └── [id]/route.js     # GET (audit status & recommendations)
│   │   ├── cron/route.js         # Endpoint for cron-job.org sub-hour triggers
│   │   └── clients/route.js      # Client profile management
│   ├── client/[id]/page.jsx      # Client-Facing Executive Dashboard
│   ├── globals.css               # Tailwind CSS styles
│   ├── layout.jsx                # App layout
│   └── page.jsx                  # Internal Admin Portal & Pipeline Tracker
├── prisma/
│   └── schema.prisma             # PostgreSQL Prisma schema (Client & Audit models)
├── src/
│   ├── ai/
│   │   └── claude.js             # Claude API integration & Master Prompt
│   ├── crawlers/
│   │   ├── cheerioCrawler.js     # Step 1 & 5: Cheerio DOM crawler
│   │   ├── pagespeed.js          # Step 2: PageSpeed Insights crawler
│   │   ├── gsc.js                # Step 3: Google Search Console crawler
│   │   ├── schemaValidator.js    # Step 4: Schema.org structured data check
│   │   ├── robotsSitemap.js      # Step 6: robots.txt and sitemap check
│   │   └── dataforseo.js         # Step 7: DataForSEO ranking tracker
│   ├── lib/
│   │   └── db.js                 # Resilient DB client (Prisma Postgres + Fallback)
│   ├── mocks/
│   │   ├── index.js              # USE_MOCKS toggle switch
│   │   ├── pagespeed.mock.js     # Mobile CWV mock data
│   │   ├── gsc.mock.js           # Query impressions & click mock data
│   │   ├── dataforseo.mock.js    # Keyword ranking mock data
│   │   └── twilio.mock.js        # Twilio WhatsApp console logger
│   ├── queues/
│   │   └── auditQueue.js         # BullMQ queue definition ('seo-audit-jobs')
│   ├── services/
│   │   ├── reportGenerator.js    # PDF report generation
│   │   └── twilioNotifier.js     # WhatsApp delivery service
│   └── workers/
│       └── auditWorker.js        # BullMQ Worker processing the 10-step pipeline
├── .env.example                  # Environment variable reference
├── package.json
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd seo-automation-dashboard
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
By default, `USE_MOCKS=true` is enabled. You can run the entire application immediately **without requiring external paid API keys**.

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to access the Admin Portal.

### 5. Optional: Run BullMQ Standalone Worker
If connecting to an Upstash Redis instance, you can run the dedicated background worker in a separate terminal:
```bash
npm run worker
```

---

## 🔌 Connecting Real Services (Zero Cost)

1. **PostgreSQL Database (Neon / Supabase)**:
   - Create a free database at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
   - Set `DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"` in `.env`.
   - Run `npx prisma db push` to push the schema models.

2. **Serverless Redis (Upstash)**:
   - Create a free Redis instance at [upstash.com](https://upstash.com).
   - Set `UPSTASH_REDIS_URL="rediss://default:token@host:6379"` in `.env`.

3. **Claude API**:
   - Add your key from [console.anthropic.com](https://console.anthropic.com) as `ANTHROPIC_API_KEY`.
   - Switch `USE_MOCKS=false` to send live requests to Claude Sonnet.

---

## 📹 Video Demonstration Guide (3–5 Minutes)

When recording your submission walkthrough for EdgeLink Technology:

1. **BullMQ Job Queue**: Open the Admin Portal at `http://localhost:3000`, enter `https://example-dental-clinic.com` (Dental Clinic, Pune, Maharashtra), and click **Queue SEO Audit in BullMQ**.
2. **Live Pipeline Progress**: Show the real-time tracker updating through Steps 1 to 10 (Cheerio DOM crawl → PageSpeed → GSC → Schema → Robots → DataForSEO → Claude AI → DB Save → PDF → WhatsApp).
3. **Claude JSON Response**: Show the structured AI analysis with score breakdown, critical issues, and quick wins.
4. **Client Portal Overview**: Click **Open Client Dashboard** to show the score circle, breakdown metrics, and filterable recommendations table (filtering by Critical, High, Medium, Low).
5. **PDF Report**: Click **Download Executive PDF** to display the generated report.
