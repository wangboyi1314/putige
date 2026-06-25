# 部署到 https://putige.vercel.app

当前环境 Vercel CLI 因 Windows 用户名含中文无法自动登录，请用下面 **方式 A（推荐）** 或 **方式 B**。

---

## 方式 A：Vercel 网页导入（最简单）

1. 打开 [vercel.com/new](https://vercel.com/new) 并登录  
2. **Import Git Repository**  
   - 若尚未推送到 GitHub：先把本项目推到你的 GitHub 仓库（见下方「推送 GitHub」）  
   - 选择仓库 → **Import**  
3. 项目名设为 **putige**（与 `putige.vercel.app` 一致）  
4. **Environment Variables** 添加：

| 变量名 | 值 |
|--------|-----|
| `DEEPSEEK_API_KEY` | 你的 DeepSeek Key |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` |
| `DEEPSEEK_MODEL` | `deepseek-chat` |
| `NEXT_PUBLIC_BASE_URL` | `https://putige.vercel.app` |
| `PAYMENT_MODE` | `demo`（虎皮椒密钥就绪后改为 `xunhu`） |

5. 点击 **Deploy**  
6. 部署完成后在 **Settings → Domains** 确认域名为 `putige.vercel.app`

### 推送 GitHub（首次）

```powershell
cd d:\Bodhi
git remote add origin https://github.com/你的用户名/putige.git
git push -u origin main
```

---

## 方式 B：用 Token 命令行部署（绕过登录 bug）

1. 打开 [vercel.com/account/tokens](https://vercel.com/account/tokens) → **Create Token**  
2. PowerShell 执行：

```powershell
cd d:\Bodhi
$env:VERCEL_TOKEN = "你的token"
npm run build
npx vercel link --project putige --yes
npx vercel env add DEEPSEEK_API_KEY production    # 粘贴 key
npx vercel env add NEXT_PUBLIC_BASE_URL production   # 填 https://putige.vercel.app
npx vercel env add PAYMENT_MODE production           # 填 demo
npx vercel --prod --yes
```

---

## 虎皮椒密钥就绪后

在 Vercel → Project **putige** → **Settings → Environment Variables** 添加：

```
XUNHU_APP_ID=你的APPID
XUNHU_APP_SECRET=你的密钥
PAYMENT_MODE=xunhu
```

保存后 **Redeploy** 一次。

---

## 本地开发

`.env.local` 已指向生产域名；本地仍用 `npm run dev`，支付模式暂为 `demo`。
