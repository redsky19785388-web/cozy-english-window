import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Pseudo-AI: keyword-based reply logic
// ---------------------------------------------------------------------------
function buildMokaReply(input: string): string {
  const lower = input.toLowerCase();
  const hasBagKeyword =
    lower.includes("bag") ||
    lower.includes("plastic") ||
    lower.includes("need");

  if (hasBagKeyword) {
    return `通じたみたい！「${input}」って言ったら、店員さんが袋をくれたよ！ありがとう！🎉`;
  }

  if (input.trim().length <= 5) {
    return `えっと…短くて聞き取ってもらえなかったみたい💦 もう少し長く言ってみてくれる？`;
  }

  return `うーん、ちょっと変な顔されちゃった。「${input}」って、こういう時あんまり言わないのかな？でもお水は買えたよ！`;
}

// ---------------------------------------------------------------------------
// POST /api/chat
// Body: { text: string }
// Returns: { id, text, sender, createdAt }  (the Moka reply)
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userText: string = (body.text ?? "").trim();

    if (!userText) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const mokaText = buildMokaReply(userText);

    // Save both messages in a transaction so they're always paired
    const [, mokaMsg] = await prisma.$transaction([
      prisma.message.create({ data: { text: userText, sender: "USER" } }),
      prisma.message.create({ data: { text: mokaText, sender: "MOKA" } }),
    ]);

    return NextResponse.json(mokaMsg);
  } catch (err) {
    console.error("[/api/chat] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET /api/chat
// Returns: Message[]  (full conversation history, oldest first)
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages);
  } catch (err) {
    console.error("[/api/chat] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
