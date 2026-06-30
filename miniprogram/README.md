# 菩提阁 · 微信小程序

与 Web 版（Next.js + Cloudflare Pages）**完全独立**：

| 项目 | 目录 | API 前缀 | 订单前缀 |
|------|------|----------|----------|
| 网站 | 仓库根目录 `src/` | `/api/*` | `ORD_*` |
| 小程序 | `miniprogram/` | `/api/mp/*` | `MP_ORD_*` |

修改任一侧代码、部署或支付配置，**不会影响另一侧**。

## 快速开始

### 1. 安装依赖

```bash
cd miniprogram
npm install
```

### 2. 开发编译

```bash
npm run dev:weapp
```

用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开 **`miniprogram`** 目录（编译输出在 `dist/`）。

### 3. 配置 AppID

编辑 `project.config.json`，将 `appid` 从 `touristappid` 改为你的小程序 AppID。

### 4. 配置合法域名

小程序后台 → 开发管理 → 开发设置 → 服务器域名：

- **request 合法域名**：`https://putige-eh2.pages.dev`

（本地调试可在开发者工具中勾选「不校验合法域名」）

## 当前功能

- 首页：功能入口
- 今日黄历：本地计算，无需网络
- 关帝灵签：抽签 + AI 解读 + 演示支付解锁详批
- 我的：API 连接检测

## 后端

小程序调用 `/api/mp/*`，部署 Web 时会一并带上（`functions/api/mp/`）。

环境变量（Cloudflare Pages，可选）：

| 变量 | 默认 | 说明 |
|------|------|------|
| `MP_PAYMENT_MODE` | `demo` | 小程序支付模式（与 Web `PAYMENT_MODE` 无关） |
| `MP_PAYMENT_MODE=wxpay` | — | 预留微信支付 JSAPI（待配置商户参数） |

## 修改 API 地址

编辑 `miniprogram/src/config/index.ts` 中的 `API_BASE`。

## 生产构建

```bash
npm run build:weapp
```

在微信开发者工具中上传 `dist/` 目录。
