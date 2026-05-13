import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { canarySubscription, canaryLesson } from "@/db/schema";
import { getSession } from "@/lib/utils";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } }, { status: 401 });
    }

    const subs = await db
      .select({
        id: canarySubscription.id,
        status: canarySubscription.status,
        createdAt: canarySubscription.createdAt,
        lessonId: canaryLesson.id,
        lessonTitle: canaryLesson.title,
        lessonSubject: canaryLesson.subject,
        lessonPrice: canaryLesson.price,
      })
      .from(canarySubscription)
      .leftJoin(canaryLesson, eq(canarySubscription.lessonId, canaryLesson.id))
      .where(eq(canarySubscription.studentId, session.user.id))
      .orderBy(desc(canarySubscription.createdAt))
      .limit(50);

    return NextResponse.json({ ok: true, data: subs });
  } catch (err) {
    console.error("[canary-subscriptions GET]", err);
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Failed to fetch subscriptions" } }, { status: 500 });
  }
}

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

    // Verify lesson exists and is approved
    const [lesson] = await db
      .select()
      .from(canaryLesson)
      .where(eq(canaryLesson.id, lessonId))
      .limit(1);

    if (!lesson) {
      return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Lesson not found" } }, { status: 404 });
    }

    // Check for existing subscription
    const [existing] = await db
      .select()
      .from(canarySubscription)
      .where(
        and(
          eq(canarySubscription.studentId, session.user.id),
          eq(canarySubscription.lessonId, lessonId)
        )
      )
      .limit(1);

    if (existing) {
      return NextResponse.json({ ok: true, data: existing, message: "Already subscribed" });
    }

    const [sub] = await db
      .insert(canarySubscription)
      .values({
        studentId: session.user.id,
        lessonId,
        status: "active",
      })
      .returning();

    return NextResponse.json({ ok: true, data: sub }, { status: 201 });
  } catch (err) {
    console.error("[canary-subscriptions POST]", err);
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Failed to create subscription" } }, { status: 500 });
  }
}
