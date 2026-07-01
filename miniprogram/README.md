# 菩提阁 · 微信小程序

与 Web 版（Next.js + Cloudflare Pages）**完全独立**：

| 项目 | 目录 | API 前缀 | 订单前缀 |
|------|------|----------|----------|
| 网站 | 仓库根目录 `src/` | `/api/*` | `ORD_*` |
| 小程序 | `miniprogram/` | `/api/mp/*` | `MP_ORD_*` |

修改任一侧代码、部署或支付配置，**不会影响另一侧**。

## 个人主体说明（重要）

**个人认证的小程序无法接入微信支付**，这是微信平台规定，不是代码问题。

本项目的应对方式：

| 场景 | 做法 |
|------|------|
| 小程序内详批 | **免费解锁**（`UNLOCK_MODE=free`，按钮为「免费查看完整详批」） |
| 后端 | 保持 `MP_PAYMENT_MODE=demo`（不扣款，仅记录解锁状态） |
| 需要收款 | 引导用户到 **网站** `https://putige-eh2.pages.dev` 用虎皮椒 H5 支付 |

若将来升级为企业主体并开通微信商户号，可将 `UNLOCK_MODE` 改为 `demo`、后端设为 `MP_PAYMENT_MODE=wxpay` 并配置商户参数。

## 快速开始

### 1. 安装依赖

```bash
cd miniprogram
npm install
```

### 2. 开发编译（必须先执行，否则开发者工具会白屏）

```bash
npm run dev:weapp
```

保持该命令运行（watch 模式），再用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开 **`miniprogram`** 目录（不是 `dist/`）。

`project.config.json` 已设置 `miniprogramRoot: "dist/"`，源码在 `src/`，需 Taro 编译后才有页面。

### 3. 配置 AppID

编辑 `project.config.json`，填写你的小程序 AppID。

### 4. 配置合法域名

小程序后台 → 开发管理 → 开发设置 → 服务器域名：

- **request 合法域名**：`https://putige-eh2.pages.dev`

本地调试可在开发者工具中勾选「不校验合法域名」。

## 当前功能

18 个页面：黄历、灵签、六爻、八字、紫微、奇门、解梦、起名、供灯、禅坐、敬香、手相面相、我的及法律页等。

AI 详批在个人小程序内**免费体验**；网站版保留付费能力。

## 后端

小程序调用 `/api/mp/*`，部署 Web 时会一并带上（`functions/api/mp/`）。

环境变量（Cloudflare Pages，可选）：

| 变量 | 默认 | 说明 |
|------|------|------|
| `MP_PAYMENT_MODE` | `demo` | 小程序模式（与 Web `PAYMENT_MODE` 无关）；个人主体保持 `demo` 即可 |

## 配置项

编辑 `miniprogram/src/config/index.ts`：

- `API_BASE`：后端地址
- `UNLOCK_MODE`：`free`（个人小程序推荐）或 `demo`
- `WEB_SITE_URL`：网站地址，供「我的」页复制

## 生产构建

```bash
npm run build:weapp
```

在微信开发者工具中上传代码（工具会读取 `dist/`）。
