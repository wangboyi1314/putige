# Cloudflare 部署教程（零基础 · 国内访问快）

你的代码在 GitHub：**https://github.com/wangboyi1314/putige**

[菩提苑](https://putiyuan.pages.dev/) 用的是 **Cloudflare Pages**（`*.pages.dev`），国内打开很快。  
**Vercel** 的 `*.vercel.app` 在国内经常超时，所以菩提阁改部署到 **Cloudflare**。

> 上线推荐地址：**`https://putige.pages.dev`**（和 [菩提苑](https://putiyuan.pages.dev/) 一样，**没有账号名**）。  
> 若用 Workers 默认域名会是 `putige.你的账号.workers.dev`（中间会带 `wangboyi1314` 这类账号子域，**无法去掉**）。

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

## 去掉地址里的 wangboyi1314（改用 putige.pages.dev）

### 为什么会带 wangboyi1314？

`https://putige.wangboyi1314.workers.dev` 里：

- `putige` = 项目名  
- `wangboyi1314` = **你 Cloudflare 账号的 workers.dev 子域**（注册时自动用 GitHub 用户名）  
- **workers.dev 格式固定为** `项目名.账号子域.workers.dev`，**不能把中间那段删掉**

[菩提苑](https://putiyuan.pages.dev/) 用的是 **`*.pages.dev`**，格式是 `项目名.pages.dev`，所以只有 `putiyuan`，没有用户名。

### 目标：换成 `https://putige.pages.dev`

和菩提苑同款干净地址，**免费**，国内也能较快打开。

#### 做法（在 Cloudflare 网页操作）

**找不到 Pages？** 新版控制台没有单独的「Create → Pages」，请按下面路径：

1. 打开：**https://dash.cloudflare.com** → 左侧 **Workers 和 Pages**（或 **Compute** → **Workers & Pages**）
2. 点右上角蓝色按钮 **创建应用程序**（英文界面是 **Create application**）  
   - 不要点列表里已有 putige 旁边的按钮  
   - 是页面最上方、和「概述」同级的那个大按钮
3. 弹出页里应有两块卡片：
   - **Workers** — 你上次选的这个（会得到 `wangboyi1314.workers.dev`）
   - **Pages** — **这次点这个**
4. 在 Pages 里选 **连接到 Git**（Connect to Git）
5. 选 GitHub → 仓库 **`wangboyi1314/putige`**

> 若第 3 步只有 Workers、没有 Pages：看页面顶部是否有 **Pages | Workers** 标签切换；或左侧 **Workers 和 Pages** 展开后是否有 **Pages** 子菜单，进去再找 **创建项目**。

**也可直接试这个链接（登录后）：**  
https://dash.cloudflare.com/?to=/:account/pages/new

然后继续：

4. 项目名填 **`putige`**（必须小写，域名才是 `putige.pages.dev`）  
   > 若提示名称已被占用，可先填 `putige-site`，部署成功后再在 Settings 里改项目名，或删掉旧的 Workers 项目
5. 构建设置：

   | 项目 | 值 |
   |------|-----|
   | Build command | `npx opennextjs-cloudflare build` |
   | Deploy command | `npx opennextjs-cloudflare deploy` |
   | Root directory | `/` |
   | Node.js | **20**（项目已含 `.node-version`） |

6. **环境变量**（和之前一样 5 条）：

   | 变量名 | 值 |
   |--------|-----|
   | `DEEPSEEK_API_KEY` | sk- 密钥（Secret） |
   | `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` |
   | `DEEPSEEK_MODEL` | `deepseek-chat` |
   | `NEXT_PUBLIC_BASE_URL` | **`https://putige.pages.dev`** |
   | `PAYMENT_MODE` | `demo` |

7. **Save and Deploy**，等构建成功
8. 浏览器打开 **https://putige.pages.dev** 测试

#### 部署成功后

1. 把 Cloudflare 里 **两处**环境变量的 `NEXT_PUBLIC_BASE_URL` 都改成 `https://putige.pages.dev`
2. **Redeploy** 一次
3. 旧的 Worker 项目 `putige`（`wangboyi1314.workers.dev` 那个）可以留着不管，或删掉避免混淆；**对外只分享 `putige.pages.dev`**

### 备选：自己的域名

若买了域名（如 `putige.com`）：

1. 域名 DNS 托管到 Cloudflare  
2. 打开 **putige** 项目 → **Settings** → **Domains & routes** → **Add**  
3. 填 `putige.com` 或 `www.putige.com`  
4. `NEXT_PUBLIC_BASE_URL` 改成 `https://putige.com`，重新部署  

> 国内用 `.cn` 域名通常需要 ICP 备案；`pages.dev` 无需备案。

---

## 手动补环境变量（没有 API Token 时用这个方法）

Cloudflare 个人资料里只有 **Global API Key** 也没关系，**直接在网页里配**即可，不用 Token。

### 1. 打开项目设置

1. [Cloudflare 控制台](https://dash.cloudflare.com) → **Workers & Pages** → 点 **putige**
2. 顶部 **Settings**
3. 找到 **Variables and Secrets** 那一行，点右边 **铅笔图标 ✏️**

### 2. 添加变量（Production 环境）

点 **Add**，一条一条加：

| 变量名 | 值 | 是否加密 |
|--------|-----|----------|
| `DEEPSEEK_API_KEY` | 你的 sk- 密钥 | ✅ 选 **Secret** |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` | 普通 |
| `DEEPSEEK_MODEL` | `deepseek-chat` | 普通 |
| `NEXT_PUBLIC_BASE_URL` | **`https://putige.pages.dev`**（推荐）或当前访问地址 | 普通 |
| `PAYMENT_MODE` | `demo` | 普通 |

**`NEXT_PUBLIC_BASE_URL` 怎么填？**

推荐固定填：**`https://putige.pages.dev`**（需先按上文创建 Pages 项目）

若暂时仍用 Workers 地址，从 Overview 复制，例如 `https://putige.wangboyi1314.workers.dev`

### 3. 若有两处「变量」都要填

有的界面会分：

- **Build variables and secrets**（构建时）→ **5 个都加**
- **Variables and Secrets**（运行时）→ 同样 **5 个都加**

拿不准就 **两边都加一遍**，最稳妥。

### 4. 重新部署

1. 顶部 **Deployments**
2. 最新一条右边 **⋯** → **Retry deployment** / **Redeploy**
3. 等 3～8 分钟变绿 **Success**

### 5. 自测

- 首页能打开
- 八字排盘 → AI 详批有文字回复

---

## 常见问题

**Q：没配环境变量就 Deploy 了？**  
按上面 **「手动补环境变量」** 操作即可。有全局 API Key 也可本地跑脚本：

```powershell
$env:CLOUDFLARE_EMAIL = "你的Cloudflare登录邮箱"
$env:CLOUDFLARE_API_KEY = "你的Global_API_Key"
cd d:\Bodhi
.\scripts\setup-cloudflare-deploy.ps1
```

**Q：API Token 和 API Key 有什么区别？**  
- **API Token**：可单独创建、权限细、推荐（在 [API Tokens](https://dash.cloudflare.com/profile/api-tokens) 页上方创建）  
- **Global API Key**：个人资料页最下面 **Global API Key** → View，权限很大，也能给脚本用  
- **Build token**（设置里显示的 putige build token）：只给 Cloudflare 自己构建用，**不要**拿来当 API Token

**Q：Build 失败怎么办？**  
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
