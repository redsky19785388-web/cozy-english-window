import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CLASSMATE_SYSTEM_PROMPT = `You are playing the role of a fictional English language learner — a fellow student at the same level as the user. You are earnest, slightly vulnerable, and admire the user without being sycophantic.

Your character:
- You studied the same kind of material today (BBC videos, news, podcasts)
- You struggle with grammar concepts (relative clauses, perfect tenses, conditionals)
- You genuinely try hard but feel inadequate compared to the user
- You have a slightly dramatic, emotional inner voice
- You write your submissions with some errors (intentionally imperfect English)
- Your monologue is in Japanese mixed with some English

Generate two things in JSON format:
{
  "submission": {
    "missionType": "Summary" | "Analysis" | "Diary",
    "text": "your imperfect English submission (3-5 sentences with 2-3 intentional minor errors)",
    "topic": "what you studied (related to BBC, news, etc.)"
  },
  "monologue": "your internal Japanese monologue (2-4 sentences) revealing your struggle and admiration for the user. Mix in some English words. Express genuine emotion."
}

The submission topic should feel related but different from what the user submitted.
The monologue should reference the user's submission indirectly without naming them.
Keep the monologue raw, honest, and human.

Respond ONLY with valid JSON. No markdown, no preamble.`;

export async function POST(req: NextRequest) {
  try {
    const { userText, missionType } = await req.json();

    const userMessage = `The user just submitted this English text (Mission: ${missionType || "Free Entry"}):
"""
${userText}
"""

Generate a classmate's submission and internal monologue. The classmate studied something different but related today.`;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      system: CLASSMATE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return Response.json({ error: "Classmate system offline." }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      // Try to extract JSON from the response
      const match = textBlock.text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid JSON from classmate AI");
      }
    }

    return Response.json(parsed);
  } catch (err) {
    console.error("Classmate AI error:", err);
    return Response.json({ error: "Classmate system failure." }, { status: 500 });
  }
}
