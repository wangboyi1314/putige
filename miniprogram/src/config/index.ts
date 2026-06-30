/** 小程序独立配置 — 不读取 Web 版 .env */
export const SITE = {
  name: "菩提阁",
  tagline: "三系命理 · 交叉验证 · 看得更准",
  disclaimer: "仅供传统文化学习与个人参考，不构成专业意见；部分解读由 AI 辅助生成。",
};

/** 后端 API 根地址（小程序专用 /api/mp/* 路由） */
export const API_BASE = "https://putige-eh2.pages.dev";

export const FEATURES = [
  { id: "lamp", title: "心愿明灯", desc: "写愿 · 点灯 · 留念", path: "/pages/lamp/index" },
  { id: "huangli", title: "今日黄历", desc: "宜忌时辰 · 完全免费", path: "/pages/huangli/index" },
  { id: "bazi", title: "八字排盘", desc: "四柱 · 五行 · 大运", path: "/pages/bazi/index" },
  { id: "qian", title: "关帝灵签", desc: "心诚则灵 · AI 解签", path: "/pages/qian/index" },
  { id: "gua", title: "六爻占卜", desc: "三铜起卦 · 本互变", path: "/pages/gua/index" },
  { id: "ziwei", title: "紫微斗数", desc: "命宫十二宫 · 格局分析", path: "/pages/ziwei/index" },
  { id: "qimen", title: "奇门遁甲", desc: "九宫八门 · 行事宜忌", path: "/pages/qimen/index" },
  { id: "dream", title: "梦境析疑", desc: "周公解梦 · 经典意象", path: "/pages/dream/index" },
  { id: "xiang", title: "掌纹面相", desc: "上传照片 · AI 相学", path: "/pages/xiang/index" },
  { id: "naming", title: "宝宝起名", desc: "八字喜忌 · 音韵寓意", path: "/pages/naming/index" },
  { id: "meditation", title: "静心禅坐", desc: "梵音导引 · 计时静坐", path: "/pages/meditation/index" },
  { id: "incense", title: "敬香礼佛", desc: "九枝敬香 · 三拜礼敬", path: "/pages/incense/index" },
] as const;

export const MASTERS = [
  { id: "huiming", name: "慧明长老", title: "古寺住持" },
  { id: "mingxin", name: "明心师父", title: "尼众法师" },
  { id: "xuanzhen", name: "玄真道长", title: "山中道人" },
] as const;

export const PRODUCTS = {
  gua_premium: { id: "gua_premium", name: "周易卦象详批", price: 8.8 },
  qian_premium: { id: "qian_premium", name: "灵签详批", price: 6.6 },
  bazi_premium: { id: "bazi_premium", name: "八字精批", price: 18.8 },
  ziwei_premium: { id: "ziwei_premium", name: "紫微斗数详批", price: 18.8 },
  ziwei_charts_premium: { id: "ziwei_charts_premium", name: "紫微十二宫星曜表", price: 12.8 },
  qimen_premium: { id: "qimen_premium", name: "奇门遁甲详批", price: 8.8 },
  qimen_charts_premium: { id: "qimen_charts_premium", name: "奇门九宫专项盘", price: 9.9 },
  dream_premium: { id: "dream_premium", name: "梦境详批", price: 6.6 },
  xiang_premium: { id: "xiang_premium", name: "掌纹面相详批", price: 18.8 },
  naming_premium: { id: "naming_premium", name: "取名完整方案", price: 15.9 },
} as const;

export type ProductId = keyof typeof PRODUCTS;

export const LAMP_TYPES = [
  { id: "peace", name: "平安灯", emoji: "🪔" },
  { id: "health", name: "健康灯", emoji: "💚" },
  { id: "study", name: "学业灯", emoji: "📚" },
  { id: "wealth", name: "财运灯", emoji: "💰" },
  { id: "love", name: "姻缘灯", emoji: "💕" },
] as const;

export const LAMP_DURATIONS = [
  { id: "1", label: "1 天", days: 1 },
  { id: "7", label: "7 天", days: 7 },
  { id: "30", label: "30 天", days: 30 },
  { id: "365", label: "365 天", days: 365 },
] as const;

export const RELATIONS = ["父母", "子女", "配偶", "兄弟姐妹", "祖辈", "自己", "其他"] as const;

export const LEGAL_LINKS = [
  { label: "用户协议", path: "/pages/legal/terms/index" },
  { label: "隐私说明", path: "/pages/legal/privacy/index" },
  { label: "AI 生成说明", path: "/pages/legal/ai/index" },
] as const;
