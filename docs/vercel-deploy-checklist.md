# Vercel deploy checklist — Supabase

## 1. Database (Supabase)

Use the Supabase project that already has tables (`AdminUser`, `Product`, etc.).

**Settings → Database → Connection string → URI → Transaction pooler (6543)** → `DATABASE_URL`

## 2. Storage

Create bucket **`uploads`** (or run `npm run configure:production` after filling `.env.production.local`).

## 3. Vercel env vars (Production)

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Supabase pooler URI |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API → Project URL |
| `SUPABASE_SERVICE_KEY` | Supabase API → service_role |
| `NEXTAUTH_SECRET` | Random string |
| `NEXTAUTH_URL` | `https://gc-atelier.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | Same as above |

## 4. One-command setup (recommended)

1. Copy `.env.production.local.example` → `.env.production.local` (or edit existing)
2. Fill `VERCEL_TOKEN`, `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
3. Run:

```bash
npm run configure:production
```

This creates the `uploads` bucket, pushes env to Vercel, and triggers redeploy.

## 5. Manual redeploy

**Deployments → Redeploy** (disable Build Cache after env changes).

## 6. Admin login

https://gc-atelier.vercel.app/admin/login

If login fails, run one-time setup:

```bash
curl -X POST https://gc-atelier.vercel.app/api/setup -H "x-setup-secret: YOUR_SECRET"
```

(After setting `SETUP_SECRET` on Vercel temporarily.)

Default: `admin@gcatelier.com` / `admin123` — change password after login.

## 7. Stripe (optional)

See `env.vercel.example`.
