# GitHub Actions 一键部署 Cloudflare Pages

目标地址：**https://putige.pages.dev**（不含 wangboyi1314）

代码已配置 `.github/workflows/deploy-cloudflare.yml`，推送到 `main` 会自动配置 Pages 并触发部署。

## 前提：Cloudflare 上要有 Pages 项目

若还没有 **Pages** 项目 `putige`：

1. [Cloudflare 控制台](https://dash.cloudflare.com) → **Workers & Pages** → **创建应用程序** → **Pages** → **连接到 Git**
2. 选仓库 `wangboyi1314/putige`，项目名 **`putige`**
3. 先随便部署一次（构建设置后面 Actions 会自动改）

> 必须是 **Pages**，不是 Workers。Workers 只会得到 `*.wangboyi1314.workers.dev`。

## 一次性配置（约 3 分钟）

打开：**https://github.com/wangboyi1314/putige/settings/secrets/actions**

添加 **Repository secrets**：

| Secret 名称 | 值 |
|-------------|-----|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token 或见下方「只有 API Key」 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账号 ID（见下方获取方式） |
| `DEEPSEEK_API_KEY` | 你的 sk- 密钥 |

### 获取 CLOUDFLARE_ACCOUNT_ID

登录 [Cloudflare](https://dash.cloudflare.com) → 右侧 **Workers & Pages** → 任意项目 → 浏览器地址栏里有 `account/一串字符/` 即为 Account ID。

或：个人资料 → **API Tokens** 页面右侧 **Account ID**。

### 只有 Global API Key（没有 API Token）

1. [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. **Create Token** → 模板选 **Edit Cloudflare Workers**，并额外勾选 **Account / Cloudflare Pages / Edit**
3. 创建后复制 Token → 填入 `CLOUDFLARE_API_TOKEN`

### 可选：修改公网地址

**Settings → Secrets and variables → Actions → Variables** 添加：

| 变量名 | 值 |
|--------|-----|
| `NEXT_PUBLIC_BASE_URL` | `https://putige.pages.dev` |

## 触发部署

配置好 Secrets 后：

1. 打开 **Actions** 标签 → **Deploy to Cloudflare** → **Run workflow**  
   或再 push 一次代码到 `main`

2. 等约 5～10 分钟，访问：**https://putige.pages.dev**

## 与 Cloudflare 网页构建的关系

若同时开启 **Cloudflare Git 构建** 和 **GitHub Actions**，会重复部署。建议：

- **二选一**：推荐只用 GitHub Actions（本方案）
- 或在 Cloudflare putige 项目 → Settings → Builds → 断开 Git / 暂停自动构建
