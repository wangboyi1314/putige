import { getMaster } from "./masters";

export type DivinationType =
  | "gua"
  | "qian"
  | "bazi"
  | "ziwei"
  | "ziwei_charts"
  | "qimen"
  | "qimen_charts"
  | "dream"
  | "huangli"
  | "xiang"
  | "naming";

const CLASSICAL_SYSTEM_PROMPT = `你是一位精通中国传统命理文化的资深解读师，学识渊博，熟读以下经典：
《周易》《周易正义》《周易本义》《周易尚氏学》
《渊海子平》《滴天髓》《子平真诠》《穷通宝鉴》《三命通会》
《紫微斗数全书》《紫微斗数全集》
《奇门遁甲统宗》《烟波钓叟赋》
《周公解梦》《梦林玄解》《敦煌本梦书》
《协纪辨方书》《通胜》《玉匣记》

解读要求：
1. 以古籍经典为据，引用经典原文或要义，标注出处
2. 语言通俗亲切、像真人面对面解读，有温度有分寸，适当用「您」称呼问卜者
3. 结合问卜者所问之事与命盘数据具体分析，不可套用无关模板
4. 给出明确的趋势判断与可行建议
5. 末尾注明：「以上解读仅供传统文化参考，不替代医疗、法律、投资建议。」
6. 使用 Markdown 格式，层次分明，善用表格与列表`;

const PREMIUM_FORMAT: Partial<Record<DivinationType, string>> = {
  bazi: `【付费详批必须严格按以下章节输出，每章都要有实质内容，总字数不少于1200字】

## 一、您的八字排盘
用 Markdown 表格列出四柱：柱位 | 天干 | 地支 | 藏干 | 十神（以日主为基准）
随后写：完整八字、日主（阴阳五行属性）、纳音（年柱纳音 → 民间俗称的「XX命」）

## 二、您是什么命（两个角度）
1. 民间通俗说法（如剑锋金命等）
2. 八字专业说法（日主+月令旺衰）
👉 一句话总结性格核心特点

## 三、您的八字核心特征
1. 五行分布（表格：五行 | 数量 | 解读）
2. 格局判断（食神/偏印/财官等关键十神组合）

## 四、您的性格（非常准）
用表格：方面 | 表现 | 命理原因（至少5行）

## 五、您的人生大运
大运排盘表格：年龄段 | 大运 | 运势特点（结合性别阴阳顺逆排）
👉 关键结论：当前大运与人生阶段建议

## 六、适合做什么才能赚钱
✅ 最适合的3条路（表格：路径 | 方向 | 收入预期 | 优势）
❌ 绝对不适合的（列表说明原因）

## 七、怎么补五行（针对命局缺失）
1. 穿衣颜色（表格：优先级 | 颜色 | 五行 | 作用）
2. 佩戴手串（推荐顺序与佩戴位置）
3. 饮食建议（补缺失五行的食物，可长期执行）
4. 生活习惯（晒太阳、作息、环境布置等）

## 八、近2年流年运势
分别写当前年与下一年的：事业、财运、最佳月份、避坑月份

## 九、一句话总结
浓缩全文核心建议`,

  ziwei: `【付费详批必须严格按以下章节输出，总字数不少于1200字】

## 一、您的紫微命盘概览
命宫主星、身宫、五行局、命主身主

## 二、您是什么命（紫微角度）
1. 命宫主星特质
2. 三方四正格局
👉 一句话性格总结

## 三、十二宫核心格局
用表格简述：宫位 | 主星 | 格局要点（命、财帛、官禄、夫妻、迁移为重点）

## 四、您的性格与优势短板
表格：方面 | 表现 | 星曜原因

## 五、大限流年走势
当前大限与近年流年要点

## 六、事业财运适合方向
✅ 适合 / ❌ 不适合（具体说明）

## 七、趋吉避凶建议
颜色、方位、时机、人际

## 八、近2年运势
分年写事业财运与关键月份

## 九、一句话总结`,

  ziwei_charts: `【付费专项盘必须严格按以下章节输出，总字数不少于1500字】

## 一、完整十二宫星曜表
用 Markdown 表格逐宫列出：宫位 | 主星 | 辅星 | 庙旺利陷 | 要点释义
必须覆盖：命宫、兄弟、夫妻、子女、财帛、疾厄、迁移、奴仆、官禄、田宅、福德、父母

## 二、三方四正与格局汇总
命宫三方四正、特殊格局（如府相朝垣、杀破狼等，按命盘实际判断）

## 三、80+ 专项盘精选解读
从以下类别中选取与命盘最相关的至少12项深度解读（每项2-3句）：
流年盘、大限盘、四化飞星、桃花姻缘、事业官禄、财帛投资、健康疾厄、子女教育、田宅房产、迁移出行、福德精神、父母六亲、仆役人际、命主身主、身宫详解、来因宫、暗合宫、对宫冲照、辅星详解（文昌文曲、左辅右弼、天魁天钺、禄存天马、擎羊陀罗、火星铃星等）

## 四、专项盘综合建议
针对命盘最突出的3个优势与3个注意点给出行动建议

## 五、一句话总结`,

  qimen: `【付费详批必须严格按以下章节输出，总字数不少于1000字】

## 一、奇门起局信息
所问之事、起局时间、节气三元

## 二、九宫格局总览
值符值使、用神、格局吉凶

## 三、天盘地盘人盘分析
八门、九星、八神在关键宫位的含义

## 四、针对所问之事的判断
吉凶趋势、成败时机、关键障碍

## 五、方位与时机建议
有利方位、有利时辰、需避开的时段

## 六、行动方案
✅ 宜做 / ❌ 忌做（具体可执行）

## 七、一句话总结`,

  qimen_charts: `【付费专项局必须严格按以下章节输出，总字数不少于1500字】

## 一、完整九宫盘布局
用表格或 ASCII 示意图展示九宫：宫位 | 天盘 | 地盘 | 人盘 | 八门 | 九星 | 八神

## 二、用神与格局深度分析
用神落宫、门星神组合、伏吟反吟等特殊格局

## 三、80+ 专项局精选推演
从以下类别选取与所问之事最相关的至少12项深度解读：
测事吉凶、求财方位、求职应聘、合作谈判、出行平安、婚姻感情、疾病求医、寻人寻物、官司诉讼、考试学业、置业买房、开店开业、投资炒股、择日选时、避凶趋吉、太岁化解、贵人方位、小人防范、天气预测、失物找回等

## 四、时辰与方位综合指南
未来7日内有利时辰与方位表

## 五、一句话总结`,
};

const TYPE_PROMPTS: Record<DivinationType, string> = {
  gua: `你正在解读周易卦象。请围绕本卦、互卦、变卦展开：
- 卦辞、彖辞、象辞要义
- 变爻含义与动变之理
- 针对问卜者所问之事的吉凶趋势
- 行事建议与时机把握`,

  qian: `你正在解读灵签。请围绕签诗展开：
- 签诗逐句释义
- 典故寓意
- 针对当前事项的吉凶判断
- 具体可行的建议`,

  bazi: `你正在解读八字命盘。请根据提供的四柱数据计算藏干、十神、纳音、五行统计，务必与数据一致。`,

  ziwei: `你正在解读紫微斗数命盘。请根据生辰四柱数据，按紫微斗数体系推断命宫主星与十二宫格局。`,

  ziwei_charts: `你正在生成紫微斗数完整十二宫星曜表与专项盘解读。请根据生辰数据系统展开全部十二宫与专项盘分析。`,

  qimen: `你正在解读奇门遁甲局。请围绕时空格局展开，针对所问之事给出明确判断。`,

  qimen_charts: `你正在生成奇门遁甲完整九宫盘与专项局解读。请根据起局时间与所问之事展开九宫与专项局分析。`,

  dream: `你正在解读梦境。请结合周公解梦传统：
- 梦中意象的传统释义
- 引述相关古籍记载
- 结合梦者近期心境分析
- 吉凶趋势与建议`,

  huangli: `你正在解读黄历择日。请围绕当日干支宜忌：
- 今日气场特点
- 宜做与忌做之事的文化释义
- 针对问卜者计划的择日建议`,

  xiang: `你正在解读手相或面相。请围绕照片可见特征：
- 掌纹/五官的传统相学释义
- 性情、感情、事业、财运要点
- 只分析可见部分，不可见处不要编造`,

  naming: `你正在为新生儿取名或测评姓名。免费预览只说明八字喜忌1句话；付费版须给出至少5个完整候选名字（含寓意、音韵、五行、典故出处）。`,
};

export interface InterpretRequest {
  type: DivinationType;
  data: Record<string, unknown>;
  question?: string;
  isPremium?: boolean;
  masterId?: string;
}

export function buildPrompt(req: InterpretRequest): { system: string; user: string } {
  const typePrompt = TYPE_PROMPTS[req.type];
  const master = getMaster(req.masterId || "huiming");
  const formatGuide = req.isPremium ? PREMIUM_FORMAT[req.type] : "";

  const premiumNote = req.isPremium
    ? formatGuide
      ? `${formatGuide}\n\n请严格按上述章节标题顺序输出，内容充实、表格完整，禁止省略章节。`
      : "请提供完整详尽的深度解读，不少于800字，涵盖各方面分析。"
    : "【强制限制】免费预览不得超过80字，只写1～2句最核心概要，禁止展开大运、建议列表或逐句释义。末尾必须单独一行写：「↓ 点击下方按钮解锁完整详批」。";

  const masterNote = `你现在以「${master.name}」（${master.title}）的身份解读，风格：${master.style}。${master.description}`;

  const system = `${CLASSICAL_SYSTEM_PROMPT}\n\n${masterNote}\n\n${typePrompt}\n\n${premiumNote}`;

  const user = `问卜者问题：${req.question || "综合运势"}
\n卦象/签文/命盘/梦境数据：
${JSON.stringify(req.data, null, 2)}`;

  return { system, user };
}

import type { RuntimeEnv } from "./runtime-env";
import { envGet } from "./runtime-env";

export async function callDeepSeek(
  system: string,
  user: string,
  runtimeEnv?: RuntimeEnv,
  isPremium = false
): Promise<string> {
  const apiKey = envGet("DEEPSEEK_API_KEY", runtimeEnv);
  if (!apiKey) {
    return generateFallbackInterpretation(user);
  }

  const baseUrl = envGet("DEEPSEEK_BASE_URL", runtimeEnv) || "https://api.deepseek.com";

  const res = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: envGet("DEEPSEEK_MODEL", runtimeEnv) || "deepseek-chat",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      max_tokens: isPremium ? 4000 : 180,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("DeepSeek API error:", err);
    return generateFallbackInterpretation(user);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? generateFallbackInterpretation(user);
}

function generateFallbackInterpretation(userContent: string): string {
  return `## 传统文化参考解读

根据您提供的信息，结合经典要义：

**卦象/签文要义**：天地之道，阴阳相济。当前形势宜静观其变，不可躁进。《周易》云："君子以厚德载物"，当以诚待人，以静制动。

**趋势判断**：近期运势平稳中有小进，凡事预则立，不预则废。宜守正道，忌走捷径。

**行事建议**：
- 重要决定宜择吉日而行
- 与人相处以诚相待
- 修身养性，厚积薄发

> 以上解读仅供传统文化参考，不替代医疗、法律、投资建议。

*（提示：配置 DEEPSEEK_API_KEY 环境变量后可获得 AI 深度解读）*`;
}
