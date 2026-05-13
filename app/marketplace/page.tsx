import { db } from "@/db";
import { canaryLesson, user } from "@/db/schema";
import { eq, desc, ilike, or } from "drizzle-orm";
import Link from "next/link";
import { BookOpen, Search, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PageProps {
  searchParams: Promise<{ q?: string; subject?: string }>;
}

export default async function MarketplacePage({ searchParams }: PageProps) {
  const { q, subject } = await searchParams;

  const lessons = await db
    .select({
      id: canaryLesson.id,
      title: canaryLesson.title,
      description: canaryLesson.description,
      subject: canaryLesson.subject,
      price: canaryLesson.price,
      aiSummary: canaryLesson.aiSummary,
      createdAt: canaryLesson.createdAt,
      teacherName: user.name,
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
        : subject
        ? ilike(canaryLesson.subject, `%${subject}%`)
        : eq(canaryLesson.status, "approved")
    )
    .orderBy(desc(canaryLesson.createdAt))
    .limit(50);

  return (
    <main className="min-h-screen bg-white">
      <header className="flex items-center justify-between border-b border-black/10 px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[#0075de]" />
          <span className="text-[15px] font-semibold tracking-tight text-black/90">LearnAI</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/app">
            <Button variant="ghost" size="sm" className="text-[15px] font-medium">Dashboard</Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" size="sm" className="text-[15px] font-medium">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="bg-[#0075de] text-white hover:bg-[#005bab] text-[15px] font-semibold rounded">Get started</Button>
          </Link>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-[40px] font-bold leading-[1.5] tracking-[-1.5px] text-black/95 mb-2">Browse lessons</h1>
          <p className="text-[16px] text-[#615d59]">{lessons.length} lesson{lessons.length !== 1 ? "s" : ""} available{q ? ` matching "${q}"` : ""}</p>
        </div>

        {/* Search */}
        <form method="GET" className="flex gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a39e98]" />
            <Input
              name="q"
              defaultValue={q}
              placeholder="Search lessons, subjects..."
              className="pl-9 border-black/20 rounded text-[14px]"
            />
          </div>
          <Button type="submit" className="bg-[#0075de] text-white hover:bg-[#005bab] rounded font-semibold">Search</Button>
        </form>

        {/* Subjects quick filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All","Mathematics","Python","Data Science","Web Development","Design","Business"].map(s => (
            <Link key={s} href={s === "All" ? "/marketplace" : `/marketplace?subject=${encodeURIComponent(s)}`}>
              <span className={`inline-block rounded-full border px-3 py-1 text-[13px] font-medium cursor-pointer transition-colors ${
                (s === "All" && !q && !subject) || subject === s
                  ? "bg-[#0075de] text-white border-[#0075de]"
                  : "bg-[#f6f5f4] border-black/10 text-black/70 hover:border-[#0075de] hover:text-[#0075de]"
              }`}>{s}</span>
            </Link>
          ))}
        </div>

        {/* Lesson grid */}
        {lessons.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-10 w-10 text-[#a39e98] mx-auto mb-4" />
            <p className="text-[16px] text-[#615d59]">No lessons found{q ? ` for "${q}"` : ""}.</p>
            <Link href="/marketplace"><Button variant="outline" className="mt-4">Clear search</Button></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {lessons.map(lesson => (
              <div key={lesson.id} className="rounded-xl border border-black/10 bg-white p-6 flex flex-col gap-3 hover:shadow-md transition-shadow" style={{boxShadow: "rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.84px"}}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[18px] font-bold text-black/90 leading-snug tracking-[-0.25px]">{lesson.title}</h3>
                  <Badge className="shrink-0 rounded-full bg-[#f2f9ff] text-[#097fe8] text-xs font-semibold border-0">{lesson.subject}</Badge>
                </div>
                <p className="text-[14px] text-[#615d59] leading-relaxed line-clamp-2">{lesson.description}</p>
                {lesson.aiSummary && (
                  <div className="rounded-lg bg-[#f6f5f4] border border-black/8 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BookOpen className="h-3 w-3 text-[#0075de]" />
                      <span className="text-[11px] font-semibold text-[#0075de] uppercase tracking-wider">AI Summary</span>
                    </div>
                    <p className="text-[13px] text-[#615d59] leading-relaxed line-clamp-3">{lesson.aiSummary}</p>
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/8">
                  <div>
                    <span className="text-[13px] text-[#a39e98]">by </span>
                    <span className="text-[13px] font-medium text-black/70">{lesson.teacherName ?? "Anonymous"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[15px] font-bold text-black/90">
                      {parseFloat(String(lesson.price ?? "0")) === 0 ? "Free" : `$${parseFloat(String(lesson.price ?? "0")).toFixed(2)}`}
                    </span>
                    <Link href={`/app`}>
                      <Button size="sm" className="bg-[#0075de] text-white hover:bg-[#005bab] rounded text-[13px] font-semibold">Subscribe</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
