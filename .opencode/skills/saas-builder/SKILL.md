---
name: SaaS Builder
description: Build a complete mini-SaaS — auth, plans and quotas, dashboard, billing-ready Stripe hooks, SQLite locally and Postgres in prod. Use when user asks for SaaS, SaaS, subscription app, or pricing plans.
---

# SaaS Builder — reusable workflow

Use this skill whenever the user wants a subscription app ready for real subscribers.

## 0. Stack decision (default, free)
- Local/dev: Node + Express + SQLite (`better-sqlite3`) + vanilla JS + CSS. Zero build.
- Prod path: same API shape → Postgres (Neon/Supabase) + Prisma, deploy on Render/Fly/Vercel.
- Auth: session cookie + bcrypt locally; Auth.js/Clerk/Supabase Auth in prod. Never store plain passwords.
- Billing: mock tier flag in DB (`free|pro`) + Stripe Checkout + webhooks code stubbed behind env vars.

## 1. Discovery (ask only what blocks you)
1. App type: task manager / notes / URL shortener / tracker.
2. One paid feature (what Pro unlocks).
3. Free limit number (e.g. 10 items).

## 2. Scaffold (files)
```
server.js        # Express API + auth + quota middleware
db.js / schema.sql  # users(id,email,hash,tier), items(id,user_id,...)
public/index.html   # landing + pricing + login
public/app.js       # dashboard CRUD
public/styles.css
package.json
README.md           # npm install && node server.js
```

## 3. Backend rules
- `POST /api/signup`, `/api/login`, `/api/logout` with bcrypt (cost 10) + HttpOnly cookie.
- `requireAuth` middleware on every `/api/*` except auth + landing.
- `requireQuota` middleware: count user items, block over Free limit with `402 + upgrade_url`.
- Validate all input server-side; never trust client tier.
- Stripe-ready: `POST /api/billing/checkout` returns 501 unless `STRIPE_SECRET_KEY` set; `POST /api/billing/webhook` verifies signature, updates `users.tier`.

## 4. Frontend rules
- One static app: `#/landing`, `#/pricing`, `#/login`, `#/app` via hash routing.
- Pricing page toggles `tier` locally in demo, calls `/api/billing/checkout` in prod.
- Dashboard shows usage bar: `used/limit` from `GET /api/me`.
- No framework; fetch JSON; escape HTML.

## 5. Verification (must run)
1. `npm install && node server.js`
2. Signup → login → create item → exceed Free limit → expect 402.
3. Upgrade tier in DB → create succeeds.
4. Logout → `/api/me` returns 401.
5. Report exact file:line for every fix.

## 6. Handoff to prod
Tell user what THEY must do (agent cannot):
- Create Stripe account, get `STRIPE_SECRET_KEY` + webhook secret.
- Create Neon/Supabase Postgres, set `DATABASE_URL`.
- `git push` + deploy on Render/Vercel + set env vars + add domain.
- Add Terms/Privacy/Refund pages before charging.

Never claim the app accepts real money until Stripe webhook is live and tested with `stripe listen`.
