# 菩提阁已上线（与菩提苑同款 Pages 静态部署）

## 当前可访问地址

**https://putige-eh2.pages.dev**（国内可打开，与 [putiyuan.pages.dev](https://putiyuan.pages.dev/) 同类）

> `putige.pages.dev` 若仍 404，是因为 Cloudflare 分配的实际子域是 `putige-eh2`（名称曾被占用）。请对外分享 **putige-eh2.pages.dev**。

## 和菩提苑的区别

| | 菩提苑 | 菩提阁 |
|---|--------|--------|
| 部署 | 静态 Pages | 静态 Pages + Functions（/api） |
| 域名 | putiyuan.pages.dev | putige-eh2.pages.dev |
| AI 解读 | 客户端/内置 | `/api/interpret`（DeepSeek） |

## 重新部署

推送 `main` 或 [Run workflow](https://github.com/wangboyi1314/putige/actions/workflows/deploy-cloudflare.yml)
