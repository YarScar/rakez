export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";

async function callOpenAI(prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });
    if (!resp.ok) return null;
    const j = await resp.json();
    return j.choices?.[0]?.message?.content?.trim() || null;
  } catch (e) {
    console.error('OpenAI error', e);
    return null;
  }
}

export async function POST(req) {
  try {
    const userId = await getUserFromToken();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { taskTitle, question } = body || {};
    if (!taskTitle || !question) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    const prompt = `The user has a task titled: "${taskTitle}". They ask: "${question}". Provide a concise, friendly explanation or answer about how to do the task, why it helps with movement/productivity/brain activity, and a quick tip.`;

    const ai = await callOpenAI(prompt);
    if (ai) return NextResponse.json({ answer: ai });

    // Fallback answer
    const fallback = `This task (${taskTitle}) encourages short, focused movement which increases blood flow, engages motor planning, and gives a quick reset for attention. Tip: try doing it in small, focused bursts and pair it with deep breaths.`;
    return NextResponse.json({ answer: fallback });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
