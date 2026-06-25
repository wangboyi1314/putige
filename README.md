# 菩提苑 · 传统文化算卦网站

以古籍为根，对接 DeepSeek 大模型，提供周易卦象、灵签、八字精批、周公解梦、黄历择日等功能，支持付费解锁深度解读。

参考站点：[putiyuan.pages.dev](https://putiyuan.pages.dev/)

## 功能模块

| 模块 | 路径 | 免费 | 付费 |
|------|------|------|------|
| 周易卦象 | `/gua` | 起卦 + 概要 | 详批 ¥9.9 |
| 传统签谱 | `/qian` | 求签 + 概要 | 详批 ¥6.6 |
| 八字精批 | `/bazi` | 排盘 + 概要 | 详批 ¥29.9 |
| 周公解梦 | `/dream` | 查询 + 概要 | 详批 ¥6.6 |
| 今日黄历 | `/huangli` | 完全免费 | — |
| 静心禅坐 | `/meditation` | 完全免费 | — |

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 DEEPSEEK_API_KEY

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## DeepSeek 配置

1. 前往 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册并获取 API Key
2. 在 `.env.local` 中设置：

```
DEEPSEEK_API_KEY=sk-xxxxxxxx
```

系统提示词已内置《周易》《渊海子平》《滴天髓》《周公解梦》等古籍知识框架，AI 会引经据典进行解读。

未配置 API Key 时，系统会返回内置的传统文化参考解读。

## 收费部署

### 演示模式（默认）

```
PAYMENT_MODE=demo
```

用户点击「解锁完整详批」即可体验付费流程，无需真实支付。

### 生产模式

1. 设置 `PAYMENT_MODE=production`
2. 配置微信支付或支付宝商户参数（见 `.env.example`）
3. 在 `src/lib/payment.ts` 和 `src/app/api/payment/` 中对接你的支付网关
4. 部署到 Vercel / Cloudflare Pages / 自有服务器

### 推荐部署

**Vercel（最简单）**

```bash
npm run build
# 推送至 GitHub 后在 Vercel 导入项目
# 在 Vercel 环境变量中配置 DEEPSEEK_API_KEY
```

**Cloudflare Pages（参考 putiyuan 的部署方式）**

```bash
npm run build
# 使用 @cloudflare/next-on-pages 或静态导出
```

## 技术栈

- **框架**: Next.js 16 + TypeScript
- **样式**: Tailwind CSS 4
- **历法**: lunar-javascript（农历、八字、黄历）
- **AI**: DeepSeek API
- **字体**: Noto Serif SC

## 项目结构

```
src/
├── app/
│   ├── page.tsx          # 首页
│   ├── gua/              # 周易卦象
│   ├── qian/             # 灵签
│   ├── bazi/             # 八字
│   ├── huangli/          # 黄历
│   ├── dream/            # 解梦
│   ├── meditation/       # 禅坐
│   └── api/
│       ├── interpret/    # AI 解读
│       └── payment/      # 支付
├── components/           # UI 组件
└── lib/                  # 核心业务逻辑
    ├── iching.ts         # 64 卦
    ├── qian.ts           # 签文
    ├── bazi.ts           # 八字排盘
    ├── huangli.ts        # 黄历
    ├── dreams.ts         # 梦境库
    ├── deepseek.ts       # AI 对接
    └── payment.ts        # 收费逻辑
```

## 自定义品牌

编辑 `src/lib/config.ts` 修改站点名称、标语和功能描述。

编辑 `src/lib/payment.ts` 中的 `PRODUCTS` 调整各功能定价。

## 免责声明

本站所有解读仅供传统文化参考，不替代医疗、法律、投资建议。
