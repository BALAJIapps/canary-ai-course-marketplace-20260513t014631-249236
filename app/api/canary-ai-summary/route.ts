import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { canaryLesson } from "@/db/schema";
import { getSession } from "@/lib/utils";
import { anthropic } from "@/lib/ai";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } }, { status: 401 });
    }

    const body = await req.json();
    const { lessonId } = body;

    if (!lessonId) {
      return NextResponse.json({ ok: false, error: { code: "VALIDATION", message: "lessonId is required" } }, { status: 400 });
    }

    const [lesson] = await db
      .select()
      .from(canaryLesson)
      .where(eq(canaryLesson.id, lessonId))
      .limit(1);

    if (!lesson) {
      return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Lesson not found" } }, { status: 404 });
    }

    // Generate AI summary using Promise.race for proper timeout
    const summaryPromise = anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Summarize this lesson in 3-4 concise sentences, highlighting the key learning outcomes for students:\n\nTitle: ${lesson.title}\nSubject: ${lesson.subject}\n\nContent:\n${lesson.content.slice(0, 3000)}`,
        },
      ],
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("AI summary timed out")), 25000)
    );

    const message = await Promise.race([summaryPromise, timeoutPromise]);
    const summary = message.content[0].type === "text" ? message.content[0].text : "Summary not available.";

    // Persist summary
    const [updated] = await db
      .update(canaryLesson)
      .set({ aiSummary: summary, updatedAt: new Date() })
      .where(eq(canaryLesson.id, lessonId))
      .returning();

    if (!updated) {
      return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Failed to persist summary" } }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data: { lessonId, summary, lesson: updated } });
  } catch (err) {
    console.error("[canary-ai-summary POST]", err);
    const message = err instanceof Error ? err.message : "Failed to generate summary";
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message } }, { status: 500 });
  }
}
