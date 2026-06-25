import { NextRequest, NextResponse } from "next/server";
import { buildPrompt, callDeepSeek, type DivinationType } from "@/lib/deepseek";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data, question, isPremium, masterId } = body as {
      type: DivinationType;
      data: Record<string, unknown>;
      question?: string;
      isPremium?: boolean;
      masterId?: string;
    };

    if (!type || !data) {
      return NextResponse.json({ error: "缺少必要参数" }, { status: 400 });
    }

    const { system, user } = buildPrompt({ type, data, question, isPremium, masterId });
    const interpretation = await callDeepSeek(system, user);

    return NextResponse.json({ interpretation });
  } catch (e) {
    console.error("Interpret API error:", e);
    return NextResponse.json({ error: "解读失败，请稍后重试" }, { status: 500 });
  }
}
