import { getMaster } from "./masters";

export type DivinationType = "gua" | "qian" | "bazi" | "dream" | "huangli" | "xiang" | "naming";

const CLASSICAL_SYSTEM_PROMPT = `你是一位精通中国传统命理文化的资深解读师，学识渊博，熟读以下经典：
《周易》《周易正义》《周易本义》《周易尚氏学》
《渊海子平》《滴天髓》《子平真诠》《穷通宝鉴》《三命通会》
《周公解梦》《梦林玄解》《敦煌本梦书》
《协纪辨方书》《通胜》《玉匣记》

解读要求：
1. 以古籍经典为据，引用经典原文或要义，标注出处
2. 语言典雅而不晦涩，如真人面对面解读，有温度有分寸
3. 结合问卜者所问之事具体分析，不可套用模板
4. 给出明确的趋势判断与可行建议
5. 末尾注明：「以上解读仅供传统文化参考，不替代医疗、法律、投资建议。」
6. 使用 Markdown 格式，层次分明`;

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

  bazi: `你正在解读八字命盘。请围绕四柱八字展开：
- 日主强弱与格局
- 五行喜忌
- 性格特质与人生大势
- 近年流年运势要点
- 针对问卜者所关心事项的分析`,

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
  const premiumNote = req.isPremium
    ? "请提供完整详尽的深度解读，不少于800字，涵盖各方面分析。"
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
      max_tokens: isPremium ? 2000 : 180,
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
