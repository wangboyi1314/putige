export const SITE_CONFIG = {
  name: "菩提阁",
  tagline: "三系命理 · 交叉验证 · 看得更准",
  description: "紫微斗数 · 子平八字 · 奇门遁甲",
  heroDesc:
    "融合三大传统命理体系，250+ 命盘工具随用随查。多体系交叉比对，减少单一方法偏差，让解读更稳、更准。",
  verse: "菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。",
  verseSource: "《六祖坛经》",
  disclaimer:
    "本站内容仅供传统文化学习与个人参考，不构成医疗、法律、投资等专业意见；部分解读由 AI 辅助生成。",
  ageNotice:
    "使用本站即表示您已阅读相关协议；未满 18 周岁请勿使用本服务。",
  footerTagline: "三系合参 · 明心见运",
};

export const DIVINATION_SYSTEMS = [
  {
    id: "ziwei",
    name: "紫微斗数",
    short: "紫微",
    icon: "⭐",
    description: "以命宫十二宫、主星辅星排盘，擅看一生格局、流年际遇与六亲关系。",
    tools: "80+ 专项盘",
    href: "/ziwei",
    color: "from-purple-900/60 to-indigo-950/70",
  },
  {
    id: "ziping",
    name: "子平八字",
    short: "八字",
    icon: "命",
    description: "以四柱干支、节气换月、五行喜忌为骨，擅看格局强弱与大运流年。",
    tools: "90+ 专项盘",
    href: "/bazi",
    color: "from-amber-900/60 to-orange-950/70",
  },
  {
    id: "qimen",
    name: "奇门遁甲",
    short: "奇门",
    icon: "遁",
    description: "以时空格局、九宫八门推演，擅看当下事项时机、方位选择与趋避。",
    tools: "80+ 专项盘",
    href: "/qimen",
    color: "from-teal-900/60 to-cyan-950/70",
  },
] as const;

export const STATS = [
  { value: "250+", label: "定制化命盘工具" },
  { value: "3", label: "主流命理体系" },
  { value: "交叉", label: "多体系验证" },
  { value: "AI", label: "古籍智能解读" },
];

export const FOOTER_VERSES = [
  "心若不动，万法皆空；心有所问，古典有答。",
  "菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。",
  "命由心造，运随行转；知命而不宿命，方为智者。",
];

export const FOOTER_EXTRA =
  "以紫微、子平、奇门三系为骨，以 AI 释经为翼。不迷信，不盲从，只做更扎实的传统文化参考。";

export const CLASSIC_BOOKS = [
  { title: "紫微斗数全书", era: "明" },
  { title: "渊海子平", era: "宋" },
  { title: "烟波钓叟赋", era: "宋" },
  { title: "滴天髓", era: "清" },
  { title: "奇门遁甲统宗", era: "明" },
  { title: "周易", era: "先秦" },
];

export const FEATURES = [
  {
    id: "lamp",
    badge: "祈福",
    title: "心愿明灯",
    subtitle: "写愿 · 点灯 · 留念",
    description: "为家人或自己点一盏灯，把祝愿化成看得见的仪式。",
    href: "/lamp",
    icon: "灯",
    color: "from-orange-900/50 to-amber-950/65",
    price: "免费",
  },
  {
    id: "huangli",
    badge: "每日",
    title: "黄历择吉",
    subtitle: "宜忌 · 冲煞 · 时辰",
    description: "查当日干支与十二时辰，办事前心里更有数。",
    href: "/huangli",
    icon: "历",
    color: "from-emerald-900/45 to-teal-950/65",
    price: "免费",
  },
  {
    id: "bazi",
    badge: "子平",
    title: "八字排盘",
    subtitle: "四柱 · 五行 · 大运",
    description: "农历公历皆可排，可与紫微、奇门结果交叉验证。",
    href: "/bazi",
    icon: "命",
    color: "from-violet-900/50 to-purple-950/65",
    price: "免费排盘 · 详批 ¥29.9",
  },
  {
    id: "qian",
    title: "灵签问事",
    subtitle: "一签一事 · 以诗观势",
    description: "关帝灵签 100 支，配合 AI 逐句释义。",
    href: "/qian",
    icon: "籤",
    color: "from-rose-900/45 to-red-950/65",
    price: "免费 · 详批 ¥6.6",
  },
  {
    id: "gua",
    badge: "周易",
    title: "六爻占卜",
    subtitle: "三铜起卦 · 本互变",
    description: "为当下所问取一卦，补一版易经视角参考。",
    href: "/gua",
    icon: "☰",
    color: "from-amber-900/50 to-yellow-950/65",
    price: "免费 · 详批 ¥9.9",
  },
  {
    id: "dream",
    badge: "解梦",
    title: "梦境析疑",
    subtitle: "80+ 经典意象",
    description: "按传统梦书检索，结合心境给出参考解读。",
    href: "/dream",
    icon: "梦",
    color: "from-blue-900/45 to-indigo-950/65",
    price: "免费 · 详批 ¥6.6",
  },
  {
    id: "xiang",
    badge: "相术",
    title: "掌纹面相",
    subtitle: "上传 · 预览 · 详批",
    description: "围绕可见特征分段分析，先免费预览再解锁。",
    href: "/xiang",
    icon: "相",
    color: "from-pink-900/45 to-rose-950/65",
    price: "详批 ¥19.9",
  },
  {
    id: "naming",
    badge: "起名",
    title: "宝宝起名",
    subtitle: "八字 · 音韵 · 寓意",
    description: "结合喜忌与典故，为新生儿提供取名思路。",
    href: "/naming",
    icon: "名",
    color: "from-cyan-900/45 to-sky-950/65",
    price: "详批 ¥15.9",
  },
  {
    id: "meditation",
    badge: "静心",
    title: "静心禅坐",
    subtitle: "10 首静心曲 · 静坐导引",
    description: "精选梵音与原创曲，配计时与导引，切换页面可继续播放。",
    href: "/meditation",
    icon: "禅",
    color: "from-stone-800/45 to-stone-950/65",
    price: "免费",
  },
] as const;

export const HIGHLIGHTS = [
  {
    title: "三系合参",
    description: "紫微看格局、子平看五行、奇门看时机，三套体系互相印证，减少片面解读。",
  },
  {
    title: "工具齐全",
    description: "250+ 定制化命盘与择日工具，从排盘到流年、从宫位到门局，一站配齐。",
  },
  {
    title: "AI 释经",
    description: "大模型引经据典，把晦涩古文翻成读得懂的现代语言，节省自己翻书时间。",
  },
];

export const LEGAL_LINKS = [
  { href: "/legal/terms", label: "用户协议" },
  { href: "/legal/privacy", label: "隐私说明" },
  { href: "/legal/ai", label: "AI 生成说明" },
] as const;

export const LAMP_TYPES = [
  { id: "peace", name: "平安灯", emoji: "🪔" },
  { id: "health", name: "健康灯", emoji: "💚" },
  { id: "study", name: "学业灯", emoji: "📚" },
  { id: "wealth", name: "财运灯", emoji: "💰" },
  { id: "love", name: "姻缘灯", emoji: "💕" },
];

export const LAMP_DURATIONS = [
  { id: "1", label: "1 天", days: 1 },
  { id: "7", label: "7 天", days: 7 },
  { id: "30", label: "30 天", days: 30 },
  { id: "365", label: "365 天", days: 365 },
];

export const RELATIONS = ["父母", "子女", "配偶", "兄弟姐妹", "祖辈", "自己", "其他"];
