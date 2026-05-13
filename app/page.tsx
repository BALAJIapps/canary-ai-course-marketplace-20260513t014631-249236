import Link from "next/link";
import { ArrowRight, GraduationCap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Nav */}
      <header className="flex items-center justify-between border-b border-black/10 px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[#0075de]" />
          <span className="text-[15px] font-semibold tracking-tight text-black/90">LearnAI</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="text-[15px] font-medium text-black/70">
              Browse lessons
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" size="sm" className="text-[15px] font-medium text-black/70">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="bg-[#0075de] text-white hover:bg-[#005bab] text-[15px] font-semibold rounded px-4">
              Start learning
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero — left-aligned, display font on h1 */}
      <section className="grid md:grid-cols-[3fr_2fr] gap-12 px-8 py-20 max-w-6xl mx-auto w-full">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#f6f5f4] px-3 py-1 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            <span className="text-[13px] font-medium text-black/60">Live marketplace &middot; lessons available now</span>
          </div>
          <h1 style={{fontFamily: 'var(--font-display), Georgia, serif'}} className="text-[54px] leading-[1.08] text-black/95 mb-6">
            Lessons taught by experts,<br />
            <em>understood</em> with AI
          </h1>
          <p className="text-[18px] font-normal leading-[1.5] text-[#615d59] mb-10 max-w-lg">
            LearnAI connects students with teacher-created lessons. Every lesson gets an AI-generated summary so you know exactly what you&apos;re signing up for before you commit.
          </p>
          <div className="flex gap-3">
            <Link href="/marketplace">
              <Button size="lg" className="bg-[#0075de] text-white hover:bg-[#005bab] font-semibold rounded px-6">
                Browse marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg" variant="outline" className="font-semibold rounded px-6 border-black/20 text-black/80">
                Teach a lesson
              </Button>
            </Link>
          </div>
        </div>

        {/* Distinctive visual: realistic AI summary preview card */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-white overflow-hidden" style={{boxShadow: "rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.84px, rgba(0,0,0,0.02) 0px 0.8px 2.93px"}}>
            <div className="bg-[#f6f5f4] px-5 py-3 border-b border-black/8">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-red-400"></div>
                <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="ml-2 text-[11px] text-[#a39e98] font-medium">learnai.app/marketplace</span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <div className="text-[11px] font-semibold text-[#a39e98] uppercase tracking-wider mb-1">Lesson</div>
                <div className="text-[16px] font-bold text-black/90 leading-tight">Introduction to Python Lists</div>
                <div className="text-[13px] text-[#a39e98] mt-1">by Test Student &middot; Python &middot; Free</div>
              </div>
              <div className="rounded-lg bg-[#f2f9ff] border border-[#c3e4fb] p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg className="h-3 w-3 text-[#0075de]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span className="text-[10px] font-semibold text-[#0075de] uppercase tracking-wider">AI Summary</span>
                </div>
                <p className="text-[12px] text-[#615d59] leading-relaxed">This lesson covers Python list fundamentals — creation, indexing, slicing, and the most-used methods. Perfect for beginners moving from variables to collections.</p>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-black/8">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-[12px] font-medium text-green-700">Admin approved</span>
                </div>
                <span className="text-[12px] font-bold text-black/60 bg-[#f6f5f4] rounded-full px-2.5 py-0.5">Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#f6f5f4] px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 style={{fontFamily: 'var(--font-display), Georgia, serif'}} className="text-[40px] leading-[1.0] text-black/95 mb-2">From lesson to learner</h2>
          <p className="text-[16px] text-[#615d59] mb-10">Three steps. No gatekeeping. AI does the heavy lifting.</p>
          <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-6">
            <div className="rounded-xl bg-white border border-black/10 p-6" style={{boxShadow: "rgba(0,0,0,0.04) 0px 4px 18px"}}>
              <div className="text-[40px] font-bold text-black/20 leading-none mb-4 font-mono">01</div>
              <h3 className="text-[18px] font-bold text-black/90 mb-2">Teacher uploads</h3>
              <p className="text-[14px] text-[#615d59] leading-relaxed">Write your lesson and submit for review. AI generates a summary instantly.</p>
            </div>
            <div className="rounded-xl bg-white border border-black/10 p-6" style={{boxShadow: "rgba(0,0,0,0.04) 0px 4px 18px"}}>
              <div className="text-[40px] font-bold text-black/20 leading-none mb-4 font-mono">02</div>
              <h3 className="text-[18px] font-bold text-black/90 mb-2">Admin approves</h3>
              <p className="text-[14px] text-[#615d59] leading-relaxed">Review queue surfaces lessons needing attention. One-click approve or reject.</p>
            </div>
            <div className="rounded-xl bg-white border border-black/10 p-6" style={{boxShadow: "rgba(0,0,0,0.04) 0px 4px 18px"}}>
              <div className="text-[40px] font-bold text-black/20 leading-none mb-4 font-mono">03</div>
              <h3 className="text-[18px] font-bold text-black/90 mb-2">Student subscribes</h3>
              <p className="text-[14px] text-[#615d59] leading-relaxed">Browse with AI summaries. Subscribe in one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison — unconventional section */}
      <section className="px-8 py-16 border-b border-black/8">
        <div className="max-w-6xl mx-auto">
          <h2 style={{fontFamily: 'var(--font-display), Georgia, serif'}} className="text-[32px] leading-snug text-black/95 mb-8">Why LearnAI beats browsing YouTube tutorials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-black/10 p-6 bg-white">
              <div className="text-[13px] font-semibold text-[#a39e98] uppercase tracking-wider mb-4">YouTube / random tutorials</div>
              <ul className="space-y-3">
                {["No quality filter — anyone can post anything", "15-minute intros before any real content", "Can't preview what you'll actually learn", "Teacher credibility unknown"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#615d59]">
                    <span className="mt-1 h-3 w-3 rounded-full border border-black/20 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[#0075de]/20 p-6 bg-[#f2f9ff]">
              <div className="text-[13px] font-semibold text-[#0075de] uppercase tracking-wider mb-4">LearnAI marketplace</div>
              <ul className="space-y-3">
                {["Admin-reviewed before going live", "AI summary tells you exactly what you'll learn", "Read the full summary before subscribing", "Verified teacher profiles with track record"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14px] text-black/70">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-[13px] font-semibold text-[#a39e98] uppercase tracking-widest mb-5">Popular subjects</p>
          <div className="flex flex-wrap gap-2">
            {["Mathematics","Python","Data Science","Web Development","Design","Business","Biology","History"].map(s => (
              <Link key={s} href={`/marketplace?q=${encodeURIComponent(s)}`}>
                <span className="inline-block rounded-full border border-black/10 bg-[#f6f5f4] px-4 py-1.5 text-[13px] font-medium text-black/70 hover:bg-white hover:border-black/20 transition-colors cursor-pointer">{s}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/8 px-8 py-5 flex items-center justify-between text-[13px] text-[#a39e98]">
        <span>LearnAI &mdash; AI-powered course marketplace</span>
        <div className="flex gap-4">
          <Link href="/marketplace" className="hover:text-black/60 transition-colors">Marketplace</Link>
          <Link href="/sign-up" className="hover:text-black/60 transition-colors">Teach</Link>
          <Link href="/app" className="hover:text-black/60 transition-colors">Dashboard</Link>
        </div>
      </footer>
    </main>
  );
}
