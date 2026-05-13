import Link from "next/link";
import { BookOpen, Users, ShieldCheck, Sparkles, ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Nav */}
      <header className="flex items-center justify-between border-b border-black/10 px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[#0075de]" />
          <span className="text-[15px] font-semibold tracking-tight text-black/90">LearnAI</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="text-[15px] font-medium text-black/70">
              Browse lessons
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" size="sm" className="text-[15px] font-medium">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="bg-[#0075de] text-white hover:bg-[#005bab] text-[15px] font-semibold rounded">
              Start learning
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero — left-aligned with visual anchor */}
      <section className="grid md:grid-cols-[3fr_2fr] gap-12 px-8 py-20 max-w-6xl mx-auto w-full">
        <div className="flex flex-col justify-center">
          <Badge className="mb-6 w-fit rounded-full bg-[#f2f9ff] text-[#097fe8] text-xs font-semibold px-3 py-1 border-0">
            AI-powered learning
          </Badge>
          <h1 className="text-[54px] font-bold leading-[1.04] tracking-[-1.875px] text-black/95 mb-6">
            Lessons taught by experts,
            <br />understood with AI
          </h1>
          <p className="text-[18px] font-normal leading-[1.5] text-[#615d59] mb-10 max-w-lg">
            LearnAI connects students with teacher-created lessons. Every lesson gets an AI-generated summary so you know exactly what you&apos;re signing up for.
          </p>
          <div className="flex gap-3">
            <Link href="/marketplace">
              <Button size="lg" className="bg-[#0075de] text-white hover:bg-[#005bab] font-semibold rounded px-6">
                Browse marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline" className="font-semibold rounded px-6 border-black/20">
                Teach a lesson
              </Button>
            </Link>
          </div>
        </div>

        {/* Visual anchor — role cards */}
        <div className="flex flex-col gap-4 justify-center">
          <div className="rounded-xl border border-black/10 bg-[#f6f5f4] p-5" style={{boxShadow: "rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.84px"}}>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-4 w-4 text-[#0075de]" />
              <span className="text-[14px] font-semibold text-black/90">For Teachers</span>
            </div>
            <p className="text-[14px] text-[#615d59]">Upload lessons, set your price, reach students worldwide. AI summarizes your content automatically.</p>
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-5" style={{boxShadow: "rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.84px"}}>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-4 w-4 text-[#0075de]" />
              <span className="text-[14px] font-semibold text-black/90">For Students</span>
            </div>
            <p className="text-[14px] text-[#615d59]">Browse AI-summarized lessons, subscribe to what matters, learn at your own pace.</p>
          </div>
          <div className="rounded-xl border border-black/10 bg-[#f6f5f4] p-5" style={{boxShadow: "rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.84px"}}>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-4 w-4 text-[#0075de]" />
              <span className="text-[14px] font-semibold text-black/90">Quality assured</span>
            </div>
            <p className="text-[14px] text-[#615d59]">Every lesson reviewed by our admin team before going live. No low-effort content.</p>
          </div>
        </div>
      </section>

      {/* How it works — unconventional: process timeline */}
      <section className="bg-[#f6f5f4] px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[40px] font-bold leading-[1.5] text-black/95 mb-2">From lesson to learner in three steps</h2>
          <p className="text-[16px] text-[#615d59] mb-10">Our pipeline makes quality teaching accessible at scale.</p>
          <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-6">
            <div className="rounded-xl bg-white border border-black/10 p-6" style={{boxShadow: "rgba(0,0,0,0.04) 0px 4px 18px"}}>
              <div className="text-[40px] font-bold text-[#0075de] leading-none mb-4">01</div>
              <h3 className="text-[18px] font-bold text-black/90 mb-2">Teacher uploads</h3>
              <p className="text-[14px] text-[#615d59] leading-relaxed">Teachers write their lesson — title, subject, full content — and submit for review. LearnAI instantly generates an AI summary.</p>
            </div>
            <div className="rounded-xl bg-white border border-black/10 p-6" style={{boxShadow: "rgba(0,0,0,0.04) 0px 4px 18px"}}>
              <div className="text-[40px] font-bold text-[#0075de] leading-none mb-4">02</div>
              <h3 className="text-[18px] font-bold text-black/90 mb-2">Admin approves</h3>
              <p className="text-[14px] text-[#615d59] leading-relaxed">Our review queue surfaces lessons needing attention. Approve or reject with a note — status updates instantly.</p>
            </div>
            <div className="rounded-xl bg-white border border-black/10 p-6" style={{boxShadow: "rgba(0,0,0,0.04) 0px 4px 18px"}}>
              <div className="text-[40px] font-bold text-[#0075de] leading-none mb-4">03</div>
              <h3 className="text-[18px] font-bold text-black/90 mb-2">Student subscribes</h3>
              <p className="text-[14px] text-[#615d59] leading-relaxed">Students browse the marketplace, read AI summaries to decide fast, and subscribe in one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects strip */}
      <section className="px-8 py-12 border-b border-black/10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[14px] font-semibold text-[#a39e98] uppercase tracking-widest mb-6">Popular subjects</p>
          <div className="flex flex-wrap gap-3">
            {["Mathematics","Python","Data Science","Web Development","Design","Business","Biology","History"].map(s => (
              <Link key={s} href={`/marketplace?q=${encodeURIComponent(s)}`}>
                <span className="inline-block rounded-full border border-black/10 bg-[#f6f5f4] px-4 py-2 text-[14px] font-medium text-black/80 hover:bg-white hover:border-[#0075de] hover:text-[#0075de] transition-colors cursor-pointer">{s}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-8 py-6 flex items-center justify-between text-[13px] text-[#a39e98]">
        <span>LearnAI &mdash; AI-powered course marketplace</span>
        <div className="flex gap-4">
          <Link href="/marketplace" className="hover:text-black/70 transition-colors">Marketplace</Link>
          <Link href="/sign-up" className="hover:text-black/70 transition-colors">Teach</Link>
          <Link href="/app" className="hover:text-black/70 transition-colors">Dashboard</Link>
        </div>
      </footer>
    </main>
  );
}
