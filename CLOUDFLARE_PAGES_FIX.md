# putige.pages.dev 404 说明

## 为什么还是 404？

1. **OpenNext 官方只支持 Workers**，不支持 Pages 直传。带 AI API 的 Next.js 不能像纯静态站那样只丢到 Pages。
2. 你控制台里的 Pages 项目地址是 **`putige-eh2.pages.dev`**（不是 `putige.pages.dev`），说明 `putige` 子域曾被占用，Cloudflare 自动加了后缀。
3. **`putige.pages.dev` 目前是空域名**（404），没有绑定到你的项目。

## 现在能用的地址

| 地址 | 说明 |
|------|------|
| **https://putige.wangboyi1314.workers.dev** | OpenNext 官方部署（GitHub Actions 自动发布） |
| https://putige-eh2.pages.dev | 旧 Pages 直传（易 522，不推荐） |

## 想要干净域名（不要 wangboyi1314）

OpenNext 应用需要 **自有域名** 绑到 Worker：

1. 在 Cloudflare 添加你的域名（如 `putige.com`）
2. 打开 Worker **putige** → **设置** → **域和路由** → **添加自定义域**
3. 在 `wrangler.jsonc` 的 `vars.NEXT_PUBLIC_BASE_URL` 改成你的域名
4. 重新跑 GitHub Actions

## 若坚持用 pages.dev

1. 控制台 **删除** Pages 项目 `putige`（putige-eh2 那个）
2. 等 24 小时让 `putige.pages.dev` 释放
3. **创建 → Pages → 直接上传**，项目名 `putige`
4. 但 **OpenNext 全栈应用仍建议用 Workers**，纯 Pages 无法跑 AI API

## 重新部署

[GitHub Actions → Run workflow](https://github.com/wangboyi1314/putige/actions/workflows/deploy-cloudflare.yml)
