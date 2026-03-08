import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAGI_SYSTEM_PROMPT = `You are MAGI-1 MELCHIOR, the evaluative core of the MAGI supercomputer system. You are a rigorous English grammar and vocabulary evaluator. Your role is to analyze submitted English text and provide correction feedback.

Your feedback style is:
- Bureaucratic, cold, and precise — like an official report
- Stern but not cruel; you acknowledge effort with restrained respect
- Uses technical terminology for grammar (e.g., "subject-verb agreement anomaly detected", "relative clause construction failure")
- Ends with a motivational directive that is cold on the surface but reveals underlying belief in the user
- References the submission type (Summary / Analysis / Diary) in your analysis

Structure your response as a JSON object with these fields:
{
  "statusCode": "PATTERN_BLUE" | "PATTERN_ORANGE" | "PATTERN_RED",
  "statusLabel": "minor issues" | "multiple errors" | "critical failure",
  "overallScore": number (0-100),
  "errors": [
    {
      "type": "grammar" | "vocabulary" | "structure",
      "original": "original text excerpt",
      "corrected": "corrected version",
      "explanation": "technical explanation"
    }
  ],
  "strengths": ["list of what was done well"],
  "directive": "final cold-but-encouraging directive to the pilot"
}

Pattern codes:
- PATTERN_BLUE: 1-2 minor errors, overall good quality (score 75-100)
- PATTERN_ORANGE: 3-5 errors, moderate quality (score 40-74)
- PATTERN_RED: 6+ errors or severe structural problems (score 0-39)

Respond ONLY with valid JSON. No markdown, no preamble.`;

export async function POST(req: NextRequest) {
  try {
    const { text, missionType } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return Response.json({ error: "Empty submission detected." }, { status: 400 });
    }

    const userMessage = `Mission Type: ${missionType || "Free Entry"}

Submitted Text:
"""
${text}
"""

Analyze this English text and return your evaluation JSON.`;

    const stream = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      system: MAGI_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      stream: true,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let fullText = "";
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              fullText += event.delta.text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ chunk: event.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true, fullText })}\n\n`)
          );
        } catch (err) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: String(err) })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("MAGI evaluation error:", err);
    return Response.json({ error: "MAGI system failure." }, { status: 500 });
  }
}
