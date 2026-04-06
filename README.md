<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk" />
  <img src="https://img.shields.io/badge/Supabase-DB-3ECF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Groq-AI-F55036?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" />
</p>

<h1 align="center">Hapiimood 🧠💜</h1>

<p align="center">
  <strong>A digital sanctuary for the mind — anonymous AI-powered mental wellness for Indian students.</strong>
</p>

<p align="center">
  <a href="https://hapiimood.dev">hapiimood.dev</a> · Built at IITD Hackathon
</p>

---

## What is Hapiimood?

Hapiimood is a production-grade AI mental wellness application designed for students experiencing academic pressure, anxiety, and emotional distress. It offers:

- 🤖 **Hapi** — an empathetic AI chat companion powered by Groq (zero-latency streaming)
- 📊 **Emotional Analytics** — mood tracking, sentiment analysis, and weekly usage charts
- 🧘 **Meditation Carousel** — guided Pranayama and mindfulness exercises
- 💨 **Quick Calm** — box breathing exercises with real-time visual feedback
- 💡 **Insight Carousel** — rotating evidence-based mental wellness lessons
- 🔐 **Radical Anonymity** — no PII stored, Supabase Row Level Security, Clerk auth

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| AI | Groq API via `@ai-sdk/groq` |
| Auth | Clerk v7 |
| Database | Supabase (PostgreSQL + RLS) |
| Styling | Tailwind CSS v4 + Framer Motion |
| Validation | Zod |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Umair-IITD/Hapiimood.git
cd Hapiimood
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in your credentials (see table below):

| Variable | Where to get it |
|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys |

### 3. Set up Supabase tables

Run the SQL script in `/supabase/schema.sql` in your Supabase SQL editor to create the `chat_messages` and `mood_logs` tables with Row Level Security enabled.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Security Architecture

- **Rate Limiting**: 60 req/min/IP enforced at middleware level
- **Input Validation**: Zod schemas on all API routes, 2000-char message cap, 50-message history limit
- **IDOR Prevention**: Every DB operation is scoped to the authenticated `userId`
- **Supabase RLS**: Row Level Security enabled on all tables
- **CSP Headers**: Strict Content Security Policy, `X-Frame-Options: SAMEORIGIN`
- **Anonymous Sessions**: No PII stored in chat messages

---

## Deployment

This app is deployed on Vercel at [hapiimood.dev](https://hapiimood.dev).

> ⚠️ For production deployment, use Clerk **production** keys (`pk_live_` / `sk_live_`), not development keys.

---

## Crisis Resources

If you are in immediate distress, please reach out:
- 🇮🇳 **Tele-MANAS (India):** 14416
- **iCall:** 9152987821

*Hapiimood is not a substitute for professional mental health care.*

---

<p align="center">Made with 💜 at IITD</p>
