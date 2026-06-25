# Cloudflare 部署教程（零基础 · 国内访问快）

你的代码在 GitHub：**https://github.com/wangboyi1314/putige**

[菩提苑](https://putiyuan.pages.dev/) 用的是 **Cloudflare Pages**（`*.pages.dev`），国内打开很快。  
**Vercel** 的 `*.vercel.app` 在国内经常超时，所以菩提阁改部署到 **Cloudflare**。

> 菩提阁有 AI 解读、支付等 **API 接口**，不能做成纯静态页，需用 Cloudflare **Workers 全栈部署**（官方推荐方式，见 [Cloudflare Next.js 文档](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)）。  
> 上线后地址形如：**`https://putige.你的子域.workers.dev`**，和 `pages.dev` 一样走 Cloudflare 全球 CDN，**国内访问速度接近菩提苑**。

按下面做，大约 **15 分钟** 可上线。

---

## 第零步：把 Cloudflare 配置推到 GitHub（只需一次）

项目里已加好 OpenNext + Wrangler 配置（`wrangler.jsonc`、`open-next.config.ts` 等）。  
在本地终端执行：

```powershell
cd d:\Bodhi
git add .
git commit -m "添加 Cloudflare Workers 部署配置"
git push
```

> 如果 `git push` 报错，先确认 GitHub 仓库 **putige** 已创建且能推送。

---

## 第一步：注册 / 登录 Cloudflare

1. 浏览器打开：**https://dash.cloudflare.com/sign-up**
2. 用 **邮箱** 注册，或选 **Continue with GitHub**（推荐，后面连仓库方便）
3. 按提示完成验证，进入控制台

---

## 第二步：连接 GitHub 仓库

1. 左侧菜单点 **Workers & Pages**
2. 右上角 **Create** → 选 **Workers**（不是纯静态的 Pages）
3. 选 **Connect to Git** → **GitHub** → **Authorize** 授权
4. 在仓库列表里选：**`wangboyi1314/putige`** → **Begin setup**

   > 列表里没有 putige：在 GitHub 授权页勾选允许访问 putige 仓库，回到 Cloudflare 刷新。

---

## 第三步：构建设置

在 **Set up your application** 页面：

| 设置项 | 填什么 |
|--------|--------|
| Project name | `putige`（小写，和 wrangler 里一致） |
| Production branch | `main` |
| Framework preset | 应自动识别 **Next.js**，没有就选 Next.js |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |

> 若界面只有一栏 **Build command**，填：`npm run deploy`（会先构建再发布）。

**Root directory**：留空 `/`  
**Node.js version**：选 **20** 或更高（有就选 22）

---

## 第四步：添加环境变量（重要）

在同一页或 **Settings → Variables and secrets** 里添加（**Production** 环境都要勾上）：

| 变量名 | 值 | 类型 |
|--------|-----|------|
| `DEEPSEEK_API_KEY` | 你的 DeepSeek 密钥（sk- 开头） | Secret（加密） |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | Plain text |
| `DEEPSEEK_MODEL` | `deepseek-chat` | Plain text |
| `NEXT_PUBLIC_BASE_URL` | 见下方说明 | Plain text |
| `PAYMENT_MODE` | `demo` | Plain text |

**关于 `NEXT_PUBLIC_BASE_URL`：**

- 第一次部署可先填：`https://putige`（占位）
- **部署成功后**，到 Workers 概览页复制真实地址，例如：  
  `https://putige.xxxxx.workers.dev`
- 回到环境变量，把 `NEXT_PUBLIC_BASE_URL` 改成这个完整地址
- 再点 **Retry deployment** 或推一次代码触发重新部署

> `demo` = 演示付费（点解锁即用）。有虎皮椒密钥后改成 `xunhu`，并增加 `XUNHU_APP_ID`、`XUNHU_APP_SECRET`。

---

## 第五步：部署

1. 点 **Save and Deploy**（或 **Deploy**）
2. 等 **3～8 分钟**（首次构建较慢，要装依赖 + 编译 Next.js）
3. 出现绿色 **Success** 即成功
4. 打开 Workers 详情页，复制 **workers.dev** 地址，例如：  
   **`https://putige.你的子域.workers.dev`**

在浏览器打开，应能看到菩提阁首页；点「八字排盘」「静心禅坐」试一下。

---

## 第六步：确认国内能访问

用手机 **4G/5G**（关 WiFi）打开上面的 workers.dev 地址。  
一般几秒内能打开，和 [putiyuan.pages.dev](https://putiyuan.pages.dev/) 类似。

若仍打不开：换浏览器、清缓存，或把地址发给我帮你看构建日志。

---

## 以后改代码怎么更新？

本地改完后：

```powershell
cd d:\Bodhi
git add .
git commit -m "更新"
git push
```

Cloudflare **自动重新构建部署**，不用再去网页点 Deploy。

---

## 和 Vercel 的关系

| | Vercel | Cloudflare |
|---|--------|------------|
| 地址 | putige.vercel.app | putige.xxx.workers.dev |
| 国内访问 | 经常超时 | 通常正常 |
| 是否还要用 | 可保留作备份 | **给国内用户用这个** |

Vercel 不用删；分享链接时请发 **Cloudflare 的 workers.dev 地址**。

---

## 可选：绑定自己的域名

以后买了域名（如 `putige.com`）：

1. 在 Cloudflare **添加站点**（DNS 托管到 Cloudflare）
2. **Workers & Pages** → 你的 **putige** 项目 → **Settings** → **Domains & routes**
3. **Add** → 填域名 → 按提示加 DNS 记录
4. 把 `NEXT_PUBLIC_BASE_URL` 改成 `https://你的域名`，重新部署

---

## 常见问题

**Q：没配环境变量就 Deploy 了？**  
在项目根目录执行（需先创建 API Token，见 `scripts/setup-cloudflare-deploy.ps1` 顶部说明）：

```powershell
$env:CLOUDFLARE_API_TOKEN = "你的Token"
cd d:\Bodhi
.\scripts\setup-cloudflare-deploy.ps1
```

脚本会自动：修正构建命令、写入环境变量、设置运行时 Secret、触发重新部署。

---  
点失败的构建记录 → 看 **Build log**，把最后几十行红色报错截图发给我。

**Q：和菩提苑为啥不是 `pages.dev`？**  
菩提苑多半是 **纯静态页**，用 Pages 的 `putiyuan.pages.dev` 即可。  
菩提阁有 **服务端 API**（AI、支付），需 **Workers 全栈**，域名是 `workers.dev`，**线路同样是 Cloudflare，国内速度相当**。

**Q：网站能开但 AI 不回复？**  
检查 `DEEPSEEK_API_KEY` 是否填对；`NEXT_PUBLIC_BASE_URL` 是否和当前访问地址一致；改完后 **重新部署**。

**Q：虎皮椒支付怎么开？**  
环境变量加 `XUNHU_APP_ID`、`XUNHU_APP_SECRET`，`PAYMENT_MODE` 改为 `xunhu`，再部署一次。  
虎皮椒回调地址填：`https://你的域名/api/payment/xunhu/notify`

**Q：本地能预览 Cloudflare 版吗？**  
需先 `npx wrangler login` 登录 Cloudflare，再执行 `npm run preview`（Windows 上 OpenNext 可能不稳定，以云端部署结果为准）。

---

## 链接汇总

| 用途 | 地址 |
|------|------|
| Cloudflare 控制台 | https://dash.cloudflare.com |
| Workers & Pages | https://dash.cloudflare.com/?to=/:account/workers-and-pages |
| 你的 GitHub 仓库 | https://github.com/wangboyi1314/putige |
| 参考站（菩提苑） | https://putiyuan.pages.dev |
| DeepSeek 密钥 | https://platform.deepseek.com |
| Cloudflare Next.js 官方说明 | https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ |
