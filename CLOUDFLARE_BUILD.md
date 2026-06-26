# Cloudflare 构建设置（复制到控制台）

目标地址：**https://putige.pages.dev**（没有 wangboyi1314）

在 **putige** 项目 → **Settings** → **Build** 中填写：

| 设置项 | 值 |
|--------|-----|
| Framework preset | Next.js（或 无） |
| Build command | `npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy` |
| Build output directory | **留空**（不要填 `/`） |
| Root directory | `/` |

> 必须是 **Pages** 项目（域名才是 `putige.pages.dev`）。  
> **Workers** 项目只会得到 `putige.wangboyi1314.workers.dev`，中间那段去不掉。

## 环境变量（Production，构建和运行都要）

| 变量名 | 值 |
|--------|-----|
| `DEEPSEEK_API_KEY` | sk- 密钥（Secret） |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` |
| `DEEPSEEK_MODEL` | `deepseek-chat` |
| `NEXT_PUBLIC_BASE_URL` | **`https://putige.pages.dev`** |
| `PAYMENT_MODE` | `demo` |

改完后：**Deployments → Retry deployment**

## GitHub Actions

已配置 `.github/workflows/deploy-cloudflare.yml`，推送 `main` 后会：

1. 自动把 Pages 构建设置和环境变量改成上面这套  
2. 触发 **putige.pages.dev** 重新部署  

需在 GitHub 配置 3 个 Secrets：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`、`DEEPSEEK_API_KEY`

## 常见失败原因

1. **建的是 Workers 不是 Pages** → 地址会带 wangboyi1314，请建 Pages 项目名 `putige`  
2. **Build command 只填 `npm run build`** → 应使用上面的 opennext 命令  
3. **构建输出目录填 `/`** → 留空  
4. **没配环境变量** → AI 和支付会失败
