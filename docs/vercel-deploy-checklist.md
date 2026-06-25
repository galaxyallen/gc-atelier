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
| `NEXTAUTH_URL` | `https://gccreativehk.com` |
| `NEXT_PUBLIC_SITE_URL` | Same as `NEXTAUTH_URL` |
| `NEXT_PUBLIC_SITE_MODE` | Optional: `test` for staging on vercel.app only |

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

https://gccreativehk.com/admin/login

If login fails, run one-time setup:

```bash
curl -X POST https://gccreativehk.com/api/setup -H "x-setup-secret: YOUR_SECRET"
```

(After setting `SETUP_SECRET` on Vercel temporarily.)

Default: `admin@gcatelier.com` / `admin123` — change password after login.

## 7. Stripe (optional, test mode)

Use `sk_test_` / `pk_test_` keys. Test card: `4242 4242 4242 4242`. See `env.vercel.example`.

## 8. Go live (after DNS + testing)

1. DNS for `gccreativehk.com` → Vercel (see `docs/vercel-git-deploy.md`)
2. Set `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` → `https://gccreativehk.com`
3. Remove `NEXT_PUBLIC_SITE_MODE` or set to `production`
4. Replace Stripe keys with `sk_live_` / `pk_live_` and configure webhook
5. Run `npm run configure:production` and redeploy
