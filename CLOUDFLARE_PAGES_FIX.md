# putige.pages.dev 404 修复（必做）

**现象**：https://putige.pages.dev 显示 404，但 https://putige.wangboyi1314.workers.dev 能打开。

**原因**：Cloudflare 里 **`putige` 这个名字被旧的 Workers 项目占用了**，Pages 生产域名无法正确生效。GitHub Actions 上传成功，但线上仍是 404。

## 一次性修复（约 2 分钟）

1. 打开 [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages)

2. **删除或停用旧 Worker `putige`**
   - 找类型为 **Workers**、地址是 `putige.wangboyi1314.workers.dev` 的项目
   - Settings → **Delete**（或至少断开 Git 自动构建）
   - ⚠️ 不要删 **Pages** 类型的 `putige`，也不要删 **putige-worker**

3. **确认 Pages 项目 `putige` 存在**
   - 类型必须是 **Pages**
   - 若没有：**创建应用程序 → Pages → 直接上传**，项目名 **`putige`**

4. **暂停 Git 自动构建**（Pages 和 Worker 都暂停，只用 GitHub Actions）

5. [GitHub Actions → Run workflow](https://github.com/wangboyi1314/putige/actions/workflows/deploy-cloudflare.yml)

6. 等 3～5 分钟，访问 **https://putige.pages.dev**

## 修复后

| 地址 | 用途 |
|------|------|
| **https://putige.pages.dev** | 主站（对外分享） |
| https://putige-worker.wangboyi1314.workers.dev | 备用 |
