import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { canaryLesson, user } from "@/db/schema";
import { getSession } from "@/lib/utils";
import { desc, eq, ilike, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const status = searchParams.get("status") ?? "approved";

    const lessons = await db
      .select({
        id: canaryLesson.id,
        title: canaryLesson.title,
        description: canaryLesson.description,
        subject: canaryLesson.subject,
        price: canaryLesson.price,
        status: canaryLesson.status,
        aiSummary: canaryLesson.aiSummary,
        createdAt: canaryLesson.createdAt,
        teacherName: user.name,
        teacherEmail: user.email,
      })
      .from(canaryLesson)
      .leftJoin(user, eq(canaryLesson.teacherId, user.id))
      .where(
        q
          ? or(
              ilike(canaryLesson.title, `%${q}%`),
              ilike(canaryLesson.description, `%${q}%`),
              ilike(canaryLesson.subject, `%${q}%`)
            )
          : eq(canaryLesson.status, status)
      )
      .orderBy(desc(canaryLesson.createdAt))
      .limit(50);

    return NextResponse.json({ ok: true, data: lessons });
  } catch (err) {
    console.error("[canary-lessons GET]", err);
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Failed to fetch lessons" } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, content, subject, price } = body;

    if (!title || !description || !content) {
      return NextResponse.json({ ok: false, error: { code: "VALIDATION", message: "title, description, and content are required" } }, { status: 400 });
    }

    const [lesson] = await db
      .insert(canaryLesson)
      .values({
        teacherId: session.user.id,
        title: String(title).slice(0, 200),
        description: String(description).slice(0, 1000),
        content: String(content).slice(0, 10000),
        subject: String(subject || "General").slice(0, 100),
        price: String(parseFloat(price ?? "0").toFixed(2)),
        status: "pending",
      })
      .returning();

    return NextResponse.json({ ok: true, data: lesson }, { status: 201 });
  } catch (err) {
    console.error("[canary-lessons POST]", err);
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Failed to create lesson" } }, { status: 500 });
  }
}
