# Cloudflare 构建设置（复制到控制台）

在 **putige** 项目 → **Settings** → **Build** 中填写：

| 设置项 | 值 |
|--------|-----|
| Framework preset | Next.js（或 无） |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Build output directory | **留空**（不要填 `/`） |
| Root directory | `/` |

## 环境变量（Production，构建和运行都要）

| 变量名 | 值 |
|--------|-----|
| `DEEPSEEK_API_KEY` | sk- 密钥（Secret） |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` |
| `DEEPSEEK_MODEL` | `deepseek-chat` |
| `NEXT_PUBLIC_BASE_URL` | `https://putige.pages.dev` 或你的 workers.dev 地址 |
| `PAYMENT_MODE` | `demo` |

改完后：**Deployments → Retry deployment**

## 常见失败原因

1. **Build command 填 `npm run build`** — 只会跑 Next.js，不会生成 Worker（已修复：应用 `build:cloudflare` 或上面的 npx 命令）
2. **Deploy 用 `npx wrangler deploy`** — 应改用 `npx opennextjs-cloudflare deploy`
3. **构建输出目录填 `/`** — 留空
4. **没配环境变量** — AI 和支付会失败
