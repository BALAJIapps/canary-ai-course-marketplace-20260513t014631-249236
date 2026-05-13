import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { canaryLesson, user } from "@/db/schema";
import { getSession } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required" } }, { status: 401 });
    }

    // Check admin role
    const [dbUser] = await db.select().from(user).where(eq(user.id, session.user.id)).limit(1);
    if (!dbUser || dbUser.role !== "admin") {
      return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Admin access required" } }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action, reviewNote } = body; // action: 'approve' | 'reject'

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ ok: false, error: { code: "VALIDATION", message: "action must be approve or reject" } }, { status: 400 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const [updated] = await db
      .update(canaryLesson)
      .set({
        status: newStatus,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        reviewNote: reviewNote ? String(reviewNote).slice(0, 500) : null,
        updatedAt: new Date(),
      })
      .where(eq(canaryLesson.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: "Lesson not found" } }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: updated });
  } catch (err) {
    console.error("[canary-lessons/approve PATCH]", err);
    return NextResponse.json({ ok: false, error: { code: "SERVER_ERROR", message: "Failed to update lesson" } }, { status: 500 });
  }
}
