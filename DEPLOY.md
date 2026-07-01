# 菩提阁 · 部署与自动收款对接指南

参照 [菩提苑](https://putiyuan.pages.dev/) 的上线方式，推荐 **Cloudflare Pages 免费域名** 或 **自有域名 + HTTPS**。自动到账必须走 **微信/支付宝商户 API**（个人收款码无法自动回调）。

---

## 一、三种收款模式对比

| 模式 | 环境变量 | 适用场景 | 能否自动到账 |
|------|----------|----------|--------------|
| 演示 | `PAYMENT_MODE=demo` | 本地体验 | 否，点击即解锁 |
| 收款码 | `PAYMENT_MODE=qr` | 个人静态收款码 | 否，手动确认 |
| **虎皮椒** | `PAYMENT_MODE=xunhu` | **个人无执照（推荐）** | **是**，自动回调 |
| 官方商户 | `PAYMENT_MODE=merchant` | 有营业执照 | **是**，官方回调 |

> 个人微信/支付宝「收款码」没有 API。无执照想自动到账，请用 **虎皮椒**（`xunhu`）。

---

## 二、域名怎么搞（参照菩提苑）

菩提苑 使用 `putiyuan.pages.dev`，即 **Cloudflare Pages 免费子域名**。你可以同样操作：

### 方案 A：Cloudflare Pages（与菩提苑同类）

1. 注册 [Cloudflare](https://dash.cloudflare.com/) 账号  
2. 把项目推到 **GitHub** 私有/公开仓库  
3. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**  
4. 选择仓库，构建配置：
   - **Framework preset**: Next.js  
   - **Build command**: `npm run build`  
   - **Build output**: 由 Cloudflare 自动识别（Next.js 全栈需开启 Node 兼容）  
5. 部署完成后获得：`https://你的项目名.pages.dev`  
6. （可选）在 **Custom domains** 绑定自己的域名，如 `bodhi.example.com`

### 方案 B：Vercel（Next.js 全栈更省事，推荐）

1. 推送代码到 GitHub  
2. 打开 [vercel.com](https://vercel.com) → **Import Project**  
3. 配置环境变量（见下文）  
4. 部署后获得：`https://项目名.vercel.app`  
5. 在 **Settings → Domains** 绑定自有域名  

### 环境变量（生产必配）

在 Cloudflare / Vercel 控制台添加（不要写进代码仓库）：

```env
DEEPSEEK_API_KEY=sk-你的key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

NEXT_PUBLIC_BASE_URL=https://你的域名.pages.dev

# demo | qr | xunhu | merchant
PAYMENT_MODE=xunhu

XUNHU_APP_ID=虎皮椒微信渠道APPID
XUNHU_APP_SECRET=虎皮椒密钥
```

虎皮椒申请步骤见 **第四节**。官方商户模式见第五节。

### Umami 访问统计（可选）

用于查看页面访问量、解锁点击、下单与支付成功漏斗。未配置时统计代码不加载，不影响站点。

1. 注册 [Umami Cloud](https://cloud.umami.is)（或 [自建 Umami](https://umami.is/docs)）
2. 新建网站，记下 **Website ID**
3. 在 **构建环境** 注入（`NEXT_PUBLIC_*` 必须参与 `npm run build`）：

```env
NEXT_PUBLIC_UMAMI_WEBSITE_ID=你的-website-id
# 自建时填写脚本地址，Cloud 版可省略
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
```

**Cloudflare Pages / GitHub Actions**：在仓库 Secrets 添加 `NEXT_PUBLIC_UMAMI_WEBSITE_ID`，推送 `main` 后自动重新部署。

**已埋点事件**（Umami → Events）：

| 事件名 | 含义 | 附带字段 |
|--------|------|----------|
| （自动） | 页面浏览 | URL |
| `unlock_click` | 点击「解锁详批」 | `product_id`, `price`, `channel` |
| `order_created` | 创建订单成功 | `product_id`, `price`, `order_suffix`, `demo_mode` |
| `payment_success` | 支付解锁成功 | `product_id`, `order_suffix`, `source` |
| `payment_error` | 下单失败 | `product_id`, `stage`, `status` / `message` |

转化漏斗参考：`页面 UV` → `unlock_click` → `order_created` → `payment_success`。

---

## 三、部署步骤（Vercel 示例，最快）

```bash
cd d:\Bodhi
npm install
npm run build          # 本地先确认能构建通过

# 初始化 git（若尚未）
git init
git add .
git commit -m "ready for deploy"

# 推到 GitHub 后在 Vercel 导入，或在本地：
npx vercel
```

首次 `vercel` 会引导登录、选项目名、写入环境变量。  
生产环境执行 `npx vercel --prod`。

---

## 四、虎皮椒聚合支付（无执照，已对接）

文档：[虎皮椒 API](https://www.xunhupay.com/doc/api/pay.html)

### 4.1 注册与签约

1. 打开 [xunhupay.com](https://www.xunhupay.com/) 注册账号  
2. 进入 **支付渠道管理 → 我的支付渠道**  
3. 分别申请 **微信支付渠道**、**支付宝渠道**（可按需只开一个）  
4. 签约通过后获得每渠道的 **APPID** 和 **APPSECRET（密钥）**  

### 4.2 环境变量

```env
PAYMENT_MODE=xunhu
NEXT_PUBLIC_BASE_URL=https://你的域名.vercel.app

XUNHU_APP_ID=微信渠道APPID
XUNHU_APP_SECRET=微信渠道密钥

# 若开通了支付宝渠道，填写下面两项（否则可不填）
XUNHU_ALIPAY_APP_ID=
XUNHU_ALIPAY_APP_SECRET=
```

### 4.3 自动到账流程（已实现）

```
用户解锁 → POST /api/payment/create → 虎皮椒返回 payUrl + 二维码
用户付款 → 虎皮椒 POST /api/payment/xunhu/notify → 标记已付
前端轮询 /api/payment/status → 自动解锁
```

代码位置：`src/lib/xunhupay.ts`、`src/app/api/payment/xunhu/notify/route.ts`

### 4.4 上线注意

- `NEXT_PUBLIC_BASE_URL` 必须是 **HTTPS 公网地址**（虎皮椒才能回调）  
- 不支持中文域名作为回调地址  
- 费率约 1.6%～2%，以虎皮椒后台为准  
- 正式流量前建议把订单从内存迁到 Redis/KV（见第六节）  

### 4.5 测试

1. 部署到 Vercel 并配好环境变量  
2. 打开任意付费功能（如灵签详批）  
3. 用 0.01 元测试（可在虎皮椒后台改测试金额或选最低价商品）  
4. 扫码支付后应自动解锁，无需点「我已支付」  

---

## 五、微信 / 支付宝官方商户 API（需营业执照）

### 4.1 需要提前准备的资质

| 平台 | 申请入口 | 常用产品 | 回调要求 |
|------|----------|----------|----------|
| 微信支付 | [pay.weixin.qq.com](https://pay.weixin.qq.com/) | Native 扫码支付 | HTTPS 公网 URL |
| 支付宝 | [open.alipay.com](https://open.alipay.com/) | 当面付（扫码） | HTTPS 公网 URL |

- 需要 **营业执照** 或符合政策的 **小微商户** 资质  
- 回调地址示例（部署后替换域名）：
  - 微信：`https://你的域名/api/payment/wechat/notify`
  - 支付宝：`https://你的域名/api/payment/alipay/notify`

### 4.2 环境变量（商户模式）

```env
PAYMENT_MODE=merchant

# 微信支付 APIv3
WECHAT_PAY_MCH_ID=商户号
WECHAT_PAY_APP_ID=公众号或小程序AppID
WECHAT_PAY_API_V3_KEY=APIv3密钥32位
WECHAT_PAY_SERIAL_NO=商户证书序列号
WECHAT_PAY_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----

# 支付宝当面付
ALIPAY_APP_ID=应用ID
ALIPAY_PRIVATE_KEY=应用私钥（PKCS8，一行或带换行）
ALIPAY_PUBLIC_KEY=支付宝公钥
```

### 4.3 自动到账流程（本项目已实现骨架）

```
用户点击「解锁」
    ↓
POST /api/payment/create  → 创建订单，向微信/支付宝下单，返回动态付款码
    ↓
前端展示付款码，每 2 秒轮询 GET /api/payment/status?orderId=xxx
    ↓
用户扫码付款
    ↓
微信/支付宝服务器 POST 回调 /api/payment/wechat/notify 或 /alipay/notify
    ↓
服务端验签 → markOrderPaid(orderId)
    ↓
轮询返回 paid: true → 前端自动解锁
```

相关代码：

- `src/lib/wechat-pay.ts` — 微信 Native 下单与回调验签（待填入证书后启用）
- `src/lib/alipay.ts` — 支付宝当面付预下单与回调验签
- `src/app/api/payment/wechat/notify/route.ts` — 微信回调
- `src/app/api/payment/alipay/notify/route.ts` — 支付宝回调
- `src/app/api/payment/status/route.ts` — 前端轮询订单状态

### 4.4 微信商户平台配置

1. 登录商户平台 → **产品中心** → 开通 **Native 支付**  
2. **账户中心 → API 安全** → 设置 APIv3 密钥、申请 API 证书  
3. **产品中心 → 开发配置** → 设置 **支付回调 URL**  
4. 将 AppID 与商户号绑定（公众号/小程序管理后台）

### 4.5 支付宝开放平台配置

1. 创建 **网页/移动应用**  
2. 添加能力：**当面付**  
3. **开发设置** → 配置 **应用网关**、**授权回调**（如需要）  
4. **接口加签方式** → 上传应用公钥，保存支付宝公钥  

### 4.6 订单存储（生产注意）

当前订单存在内存 `Map` 中，**Serverless 多实例/冷启动会丢单**。正式上线请任选其一：

- [Vercel KV](https://vercel.com/docs/storage/vercel-kv)  
- [Upstash Redis](https://upstash.com/)  
- [Turso](https://turso.tech/) / PlanetScale 等数据库  

把 `src/lib/payment.ts` 中的 `orders` 读写改为 KV/DB 即可。

---

## 五、与菩提苑架构的异同

| 项目 | 菩提苑 | 菩提阁（本项目） |
|------|--------|------------------|
| 前端托管 | Cloudflare Pages | 建议 Vercel 或 CF Pages |
| 域名 | `*.pages.dev` | 同样可用 `*.pages.dev` |
| 后端 API | 独立 Node 服务 + 隧道 | Next.js API Routes 内置 |
| AI | 自有后端转发 | 直接调 DeepSeek |
| 支付 | 商户/后端处理 | `PAYMENT_MODE=merchant` + 回调 |

若你希望 **完全复刻菩提苑**（前端 Pages + 独立 API 服务器），可把 `src/app/api/*` 拆到单独 Node 项目，前端 `NEXT_PUBLIC_API_URL` 指向该服务；当前单体 Next.js 部署更简单。

---

## 六、上线检查清单

- [ ] `npm run build` 通过  
- [ ] 生产环境变量已配置（含 `NEXT_PUBLIC_BASE_URL`）  
- [ ] DeepSeek 解读接口在生产域名下可调用  
- [ ] `PAYMENT_MODE` 设为 `merchant` 且商户参数齐全  
- [ ] 微信/支付宝回调 URL 已在商户后台配置且可公网访问  
- [ ] 用 0.01 元测试单走完：下单 → 扫码 → 自动解锁  
- [ ] 订单持久化已从内存迁到 KV/DB（正式流量前必做）  
- [ ] （可选）`NEXT_PUBLIC_UMAMI_WEBSITE_ID` 已配置，Umami 能看到页面与事件  

---

## 七、常见问题

**Q：能不能继续用个人收款码又自动到账？**  
A：不能。只有商户 API 下单产生的 **动态码** 才带 `out_trade_no`，平台才会回调。

**Q：没有营业执照怎么办？**  
A：可继续用 `PAYMENT_MODE=qr` 展示你的收款码；或申请微信/支付宝 **小微商户**。

**Q：域名必须备案吗？**  
A：`*.pages.dev` / `*.vercel.app` 无需自己备案。绑定 **国内服务器 + 自有 .cn 域名** 通常需要 ICP 备案。
