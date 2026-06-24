# Vercel + GitHub 自动部署指南

适用于：**在 Vercel 网页控制台连接 Git 仓库**，推送代码后自动构建部署。

---

## 1. 推送代码到 GitHub

本项目的 Git 仓库在 `gc-atelier/` 目录内（不是上级 `GC ATELIER` 文件夹）。

### 1.1 在 GitHub 创建空仓库

例如：`gc-atelier`（不要勾选「Add README」）

### 1.2 本地提交并推送

在 `gc-atelier` 目录执行：

```bash
git add .
git commit -m "Prepare Vercel + Supabase deployment"
git branch -M main
git remote add origin https://github.com/你的用户名/gc-atelier.git
git push -u origin main
```

> 当前默认分支是 `master`，建议改为 `main`（Vercel 默认 Production Branch 为 `main`）。

---

## 2. 在 Vercel 导入项目

1. 打开 [vercel.com/new](https://vercel.com/new)
2. 选择 **Import Git Repository** → 选中刚推送的仓库
3. 项目配置：

| 项 | 值 |
|----|-----|
| Framework Preset | Next.js（自动识别） |
| Root Directory | **留空**（仓库根目录就是 Next.js 项目） |
| Build Command | 自动读取 `vercel.json`：`prisma generate && prisma migrate deploy && next build` |
| Install Command | `npm install` |

4. 先**不要**点 Deploy — 先配置环境变量（下一步）

---

## 3. 配置环境变量（Production）

Vercel → Project → **Settings** → **Environment Variables**

对照 `env.vercel.example` 添加（Environment 选 **Production**）：

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | Supabase Postgres URI（建议 Transaction pooler，端口 6543） |
| `NEXTAUTH_SECRET` | 随机长字符串 |
| `NEXTAUTH_URL` | `https://gccreativehk.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://gccreativehk.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase **service_role** key |
| `NEXT_PUBLIC_SHOP_CURRENCY` | `USD` |
| `STRIPE_SECRET_KEY` | Stripe 密钥 |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook 签名 |
| `STRIPE_CURRENCY` | `usd` |

**不要**在 Vercel 设置 `USE_LOCAL_UPLOADS`（生产环境应走 Supabase Storage）。

### Supabase 准备（首次）

在 Supabase 控制台：

1. 创建项目，复制 Database URI → `DATABASE_URL`
2. Settings → API → 复制 URL 与 service_role → Supabase 变量
3. 创建 Storage bucket：`uploads`（private 即可，由 `/uploads/*` API 代理访问）

本地可执行（填入 Supabase 变量后）：

```bash
npm run supabase:setup
```

---

## 4. 首次部署

1. 确认环境变量已保存
2. Vercel → **Deployments** → **Redeploy** 或推送新 commit 触发构建
3. 构建成功后访问 Vercel 提供的预览域名验证

### 若构建失败

| 错误 | 处理 |
|------|------|
| `prisma migrate deploy` 失败 | 检查 `DATABASE_URL` 是否正确、Supabase 数据库可访问 |
| `DATABASE_URL` invalid | 必须是 `postgresql://` 开头，不能是 `file:./dev.db` |
| 图片上传失败 | 检查 Supabase Storage 变量与 `uploads` bucket |

---

## 5. 绑定自定义域名

Vercel → Project → **Settings** → **Domains**：

- `gccreativehk.com`
- `www.gccreativehk.com`

按 Vercel 提示在域名 DNS 添加记录（通常 A `@` → `76.76.21.21`，CNAME `www` → `cname.vercel-dns.com`）。

---

## 6. 初始化生产数据（一次性）

1. 在 Vercel 临时添加 `SETUP_SECRET`（随机字符串）
2. Redeploy 后执行：

```bash
curl -X POST https://gccreativehk.com/api/setup \
  -H "x-setup-secret: 你的SETUP_SECRET"
```

3. 成功后**删除** `SETUP_SECRET` 并再次 Redeploy

默认管理员（seed 后请改密码）：`admin@gcatelier.com` / `admin123`

---

## 7. 日常发布

```bash
git add .
git commit -m "描述变更"
git push origin main
```

Vercel 自动构建 Production 部署。

---

## 8. Stripe Webhook

Stripe Dashboard → Webhooks → 添加端点：

- URL：`https://gccreativehk.com/api/payments/webhook`
- 事件：`checkout.session.completed`、`checkout.session.expired`

Signing secret → Vercel 环境变量 `STRIPE_WEBHOOK_SECRET`

---

*更新：2026-06-24*
