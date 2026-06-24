# GC Atelier

Next.js 14 CMS + storefront for [gccreativehk.com](https://gccreativehk.com).

**部署：** Vercel + Supabase（Postgres + Storage）

## 快速开始（本地）

```bash
npm install
cp .env.example .env.local
# 编辑 .env.local — DATABASE_URL 需为 Supabase Postgres URI（见下方说明）
npm run dev
```

本地开发已默认 `USE_LOCAL_UPLOADS=true`，图片写入 `public/uploads/`。

## Vercel 部署（Git 自动部署，推荐）

完整步骤见 **[docs/vercel-git-deploy.md](./docs/vercel-git-deploy.md)**。

简要流程：

1. 将本仓库推送到 GitHub（仓库根目录即 `gc-atelier`，**Root Directory 留空**）
2. [vercel.com/new](https://vercel.com/new) → Import Git Repository
3. 按 `env.vercel.example` 在 Vercel 配置 **Production** 环境变量
4. 推送 `main` 分支 → 自动构建部署
5. 绑定域名 `gccreativehk.com`，执行一次性 `/api/setup` 初始化数据

也可使用 Token CLI 部署：`npm run deploy`（需 `.env.production.local`，见 `.env.production.local.example`）。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地开发 |
| `npm run build` | 生产构建 |
| `npm run db:migrate` | 开发数据库迁移 |
| `npm run db:deploy` | 生产迁移 |
| `npm run db:seed` | 种子数据 |
| `npm run supabase:setup` | 创建 Storage bucket |
| `npm run migrate:uploads` | 本地图片上传到 Supabase |
| `npm run deploy:check-env` | 检查 Vercel 环境变量 |

## 文档

- [开发手册](./docs/开发手册.md)
- [运维手册](./docs/运维手册.md)
