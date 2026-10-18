# Mini-SaaS (Taskflow)

Assumptions (you said yes, no blockers): **task manager**, Pro = unlimited tasks, Free limit = **10**.

## Run
```
cd saas
npm install
node server.js
```
Open http://localhost:3000

## Verify
1. Signup → login → add 10 tasks OK, 11th → `402 quota_exceeded`.
2. Pricing → Upgrade (demo) → add succeeds (unlimited).
3. Logout → `GET /api/me` → 401.

## Prod handoff (you do this)
- Stripe: set `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`, implement real checkout.
- Postgres: set `DATABASE_URL`, port schema via Prisma.
- Deploy: push to GitHub → Render/Vercel, set env vars, add domain + Terms/Privacy.
