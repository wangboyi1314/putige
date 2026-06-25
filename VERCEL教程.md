# Vercel 部署教程（零基础 · 只用网页）

你的代码已经在 GitHub：**https://github.com/wangboyi1314/putige**  
按下面做，大约 **10 分钟** 就能上线 **https://putige.vercel.app**。

---

## 第一步：注册 / 登录 Vercel

1. 浏览器打开：**https://vercel.com**
2. 右上角点 **Sign Up**（注册）或 **Log In**（登录）
3. 选 **Continue with GitHub**（用 GitHub 登录）—— 最重要，这样后面才能导入你的仓库
4. 按提示授权，允许 Vercel 访问你的 GitHub

---

## 第二步：导入项目

1. 登录后进入控制台，点 **Add New…** → **Project**  
   或直接打开：**https://vercel.com/new**

2. 在 **Import Git Repository** 列表里找到：  
   **`wangboyi1314/putige`**  
   点右边的 **Import**

   > 如果列表里没有 putige：点 **Adjust GitHub App Permissions**，勾选允许访问 putige 仓库，刷新页面。

3. **Configure Project** 页面：

   | 设置项 | 填什么 |
   |--------|--------|
   | Project Name | `putige`（必须小写，和域名一致） |
   | Framework Preset | 自动识别 **Next.js**，不用改 |
   | Root Directory | 留空 |
   | Build Command | 默认 `npm run build`，不用改 |
   | Output Directory | 默认，不用改 |

---

## 第三步：添加环境变量（重要）

在 **Environment Variables** 区域，一条一条添加：

| Name（变量名） | Value（值） |
|----------------|-------------|
| `DEEPSEEK_API_KEY` | 你的 DeepSeek 密钥（sk- 开头） |
| `DEEPSEEK_BASE_URL` | `https://api.deepseek.com` |
| `DEEPSEEK_MODEL` | `deepseek-chat` |
| `NEXT_PUBLIC_BASE_URL` | `https://putige.vercel.app` |
| `PAYMENT_MODE` | `demo` |

每条填完后点 **Add**。

> `demo` 表示演示付费：点解锁就能用，等你有了虎皮椒密钥再改成 `xunhu`。

---

## 第四步：点部署

1. 拉到页面最下面，点蓝色大按钮 **Deploy**
2. 等待 1～3 分钟，出现 **Congratulations** 就成功了
3. 点 **Visit** 或打开：**https://putige.vercel.app**

---

## 第五步：确认域名（一般自动就有）

1. 进入项目 → 顶部 **Settings** → 左侧 **Domains**
2. 应该能看到 `putige.vercel.app`  
   没有的话点 **Add**，输入 `putige.vercel.app`

---

## 以后改代码怎么更新？

本地改完代码后，在终端执行：

```powershell
cd d:\Bodhi
git add .
git commit -m "更新"
git push
```

Vercel 会 **自动重新部署**，不用再去网页点 Deploy。

---

## 常见问题

**Q：Build 失败怎么办？**  
点失败的 Deployment → 看红色 **Build Logs**，把报错截图发给我。

**Q：网站能打开但 AI 不回复？**  
检查 **Settings → Environment Variables** 里 `DEEPSEEK_API_KEY` 是否填对，改完后 **Deployments** → 最新一条右边 **⋯** → **Redeploy**。

**Q：虎皮椒支付怎么开？**  
在环境变量里加 `XUNHU_APP_ID`、`XUNHU_APP_SECRET`，把 `PAYMENT_MODE` 改成 `xunhu`，再 Redeploy 一次。

**Q：不想用命令行更新？**  
也可以在 GitHub 网页上直接改文件，保存后 Vercel 同样会自动部署。

---

## 链接汇总

| 用途 | 地址 |
|------|------|
| Vercel 新建项目 | https://vercel.com/new |
| 你的 GitHub 仓库 | https://github.com/wangboyi1314/putige |
| 上线后访问 | https://putige.vercel.app |
| DeepSeek 密钥 | https://platform.deepseek.com |
