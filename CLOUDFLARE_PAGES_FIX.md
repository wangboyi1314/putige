# putige.pages.dev 仍 404 时（一次性修复）

GitHub Actions 已成功时，若 **https://putige.pages.dev** 仍 404，通常是 Cloudflare 里 **Workers 与 Pages 同名冲突**。

OpenNext 必须部署 **Worker**；干净域名 **putige.pages.dev** 必须部署 **Pages** 项目名 `putige`。两者不能共用同一个 Cloudflare 应用名。

## 当前架构（代码已配置）

| 类型 | 名称 | 地址 |
|------|------|------|
| **Pages**（主站） | `putige` | **https://putige.pages.dev** |
| **Worker**（备用） | `putige-worker` | https://putige-worker.wangboyi1314.workers.dev |

## 控制台操作（约 3 分钟）

1. 打开 [Cloudflare Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. **旧 Worker `putige`**（地址带 `putige.wangboyi1314.workers.dev`）  
   - 若存在：Settings → Builds → **断开 Git / 暂停自动构建**（避免与 GitHub Actions 重复）  
   - 可选：删除该 Worker（GitHub Actions 会部署新的 `putige-worker`）

3. **确认 Pages 项目 `putige` 存在**  
   - 类型必须是 **Pages**（图标/标签与 Workers 不同）  
   - 若没有：**创建应用程序 → Pages → 直接上传**，项目名填 **`putige`**（小写）

4. **关闭 Pages 上的 Git 自动构建**（若曾连接 GitHub）  
   - putige → Settings → Builds → 暂停自动部署  
   - **只用 GitHub Actions 部署**（避免冲突）

5. 打开 GitHub → **Actions** → **Deploy to Cloudflare** → **Run workflow**

6. 等 2～5 分钟后访问：**https://putige.pages.dev**

## 验证

- 主站：https://putige.pages.dev  
- 备用：https://putige-worker.wangboyi1314.workers.dev  

两个都应显示「菩提阁」首页。
