export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

const FALLBACK_TASKS = [
  {
    title: "Two-minute mindful hand stretch",
    desc: "Spend two minutes gently stretching and moving your fingers and wrists. Focus on breathing while you move to boost circulation and calm your mind."
  },
  {
    title: "Brain-boosting pattern drawing",
    desc: "Draw a simple repeating pattern for 3 minutes. Keep your hand moving steadily to engage fine motor control and spark creativity."
  },
  {
    title: "Standing reach sequence",
    desc: "Stand up and do a sequence of gentle reaches and side bends for one minute to increase blood flow and clear your head."
  }
];

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
        max_tokens: 200,
      }),
    });
    if (!resp.ok) return null;
    const j = await resp.json();
    const txt = j.choices?.[0]?.message?.content?.trim();
    return txt || null;
  } catch (e) {
    console.error('OpenAI error', e);
    return null;
  }
}

export async function GET(req) {
  try {
    const userId = await getUserFromToken();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check if a daily bonus task already exists for today (use UTC boundaries)
    const todayStart = new Date();
    todayStart.setUTCHours(0,0,0,0);
    const todayEnd = new Date();
    todayEnd.setUTCHours(23,59,59,999);

    // Try to generate a task via OpenAI
    let generated = null;
    const prompt = `Create a single short daily micro-task (title and one-sentence description) that encourages movement, productivity, or brain stimulation. Keep it concise.`;
    const aiText = await callOpenAI(prompt);
    if (aiText) {
      // Expecting something like: Title: ...\nDescription: ...
      const lines = aiText.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length >= 1) {
        const title = lines[0].replace(/^Title:\s*/i, '').slice(0, 150);
        const desc = (lines.slice(1).join(' ') || '').slice(0, 600);
        if (title) generated = { title, desc };
      }
    }

    if (!generated) {
      // fallback pick
      const pick = FALLBACK_TASKS[Math.floor(Math.random() * FALLBACK_TASKS.length)];
      generated = { title: pick.title, desc: pick.desc };
    }

    // See if a task with same title exists today for this user
    const existing = await prisma.task.findFirst({
      where: {
        userId,
        title: generated.title,
        createdAt: { gte: todayStart, lte: todayEnd }
      }
    });

    if (existing) {
      return NextResponse.json({ task: existing, created: false });
    }

    // Create task with a BONUS marker so it awards 15 points when completed
    const descWithBonus = `BONUS:15\n${generated.desc}`;
    const task = await prisma.task.create({
      data: {
        userId,
        title: generated.title,
        description: descWithBonus,
        completed: false
      }
    });

    // Immediately check for duplicates created by concurrent requests within the same UTC day.
    const duplicates = await prisma.task.findMany({
      where: {
        userId,
        title: generated.title,
        createdAt: { gte: todayStart, lte: todayEnd }
      },
      orderBy: { createdAt: 'asc' }
    });

    if (duplicates.length > 1) {
      // Keep the earliest one and remove the others to avoid duplicates
      const keeper = duplicates[0];
      const remove = duplicates.slice(1).map(d => d.id);
      await prisma.task.deleteMany({ where: { id: { in: remove } } });
      return NextResponse.json({ task: keeper, created: keeper.id === task.id });
    }

    return NextResponse.json({ task, created: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
