# Vercel deploy checklist — open this if build fails

## 1. Database (required for build)

**Option A — Vercel Postgres (easiest)**
1. Vercel project → **Storage** → **Create Database** → Postgres
2. **Connect** database to this project
3. Redeploy — auto injects `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`

**Option B — Supabase**
Add in Settings → Environment Variables → Production:
`DATABASE_URL=postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true`

## 2. Required env vars (Production)

```
NEXTAUTH_SECRET=<random-32+ chars>
NEXTAUTH_URL=https://gccreativehk.com
NEXT_PUBLIC_SITE_URL=https://gccreativehk.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=<service_role>
```

## 3. Redeploy

Deployments → latest → **Redeploy** (use existing Build Cache: No if env just changed)

## 4. After success

```bash
curl -X POST https://gccreativehk.com/api/setup -H "x-setup-secret: YOUR_SECRET"
```

See `env.vercel.example` for Stripe variables.
