export const runtime = "nodejs";
import { NextResponse } from "next/server";

const FACTS = [
  "Moving your hands and body releases endorphins which can reduce stress and improve mood.",
  "Short hand and arm movements can increase focus and help process emotions more effectively.",
  "Gentle movement stimulates blood flow and can produce a calming effect within minutes.",
  "Creative hand activities (like drawing or crafting) boost dopamine and support wellbeing.",
  "Even brief movement breaks help reset the nervous system and lower anxiety levels."
];

export async function GET() {
  try {
    const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
    return NextResponse.json({ fact });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
