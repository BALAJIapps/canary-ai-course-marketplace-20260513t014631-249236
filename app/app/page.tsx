'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, ShieldCheck, Users, Sparkles, LogOut, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

interface Lesson {
  id: string;
  title: string;
  description: string;
  subject: string;
  price: string;
  status: string;
  aiSummary: string | null;
  teacherName: string | null;
  teacherEmail: string | null;
  createdAt: string;
}

interface Subscription {
  id: string;
  status: string;
  lessonId: string | null;
  lessonTitle: string | null;
  lessonSubject: string | null;
  lessonPrice: string | null;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    active: 'bg-[#f2f9ff] text-[#097fe8] border-[#c3e4fb]',
    cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${map[status] ?? 'bg-gray-50 text-gray-600'}`}>
      {status}
    </span>
  );
}

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      errMsg = data?.error?.message ?? errMsg;
    } catch { /* ignore parse errors */ }
    throw new Error(errMsg);
  }
  return res.json();
}

export default function DashboardPage() {
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [mySubscriptions, setMySubscriptions] = useState<Subscription[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState<string | null>(null);
  const [approvalLoading, setApprovalLoading] = useState<string | null>(null);
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({ title: '', description: '', content: '', subject: '', price: '0' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAllLessons();
    fetchSubscriptions();
  }, []);

  async function fetchAllLessons() {
    setLoadingLessons(true);
    try {
      const [pendingData, approvedData] = await Promise.all([
        apiFetch('/api/canary-lessons?status=pending'),
        apiFetch('/api/canary-lessons?status=approved'),
      ]);
      setAllLessons([...(pendingData.data ?? []), ...(approvedData.data ?? [])]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load lessons');
    } finally {
      setLoadingLessons(false);
    }
  }

  async function fetchSubscriptions() {
    setLoadingSubs(true);
    try {
      const data = await apiFetch('/api/canary-subscriptions');
      const subs: Subscription[] = data.data ?? [];
      setMySubscriptions(subs);
      setSubscribedIds(new Set(subs.map((s) => s.lessonId).filter((id): id is string => id !== null)));
    } catch (err: unknown) {
      // 401 is expected for unauthenticated users — silently ignore
      if (!(err instanceof Error && err.message.startsWith('HTTP 401'))) {
        toast.error(err instanceof Error ? err.message : 'Failed to load subscriptions');
      }
    } finally {
      setLoadingSubs(false);
    }
  }

  async function handleCreateLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.description || !form.content) {
      toast.error('Title, description, and content are required');
      return;
    }
    setCreating(true);
    try {
      await apiFetch('/api/canary-lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      toast.success('Lesson submitted for review!');
      setForm({ title: '', description: '', content: '', subject: '', price: '0' });
      fetchAllLessons();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create lesson');
    } finally {
      setCreating(false);
    }
  }

  async function handleAISummary(lessonId: string) {
    setSummaryLoading(lessonId);
    try {
      await apiFetch('/api/canary-ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      });
      toast.success('AI summary generated!');
      fetchAllLessons();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setSummaryLoading(null);
    }
  }

  async function handleApproval(lessonId: string, action: 'approve' | 'reject') {
    setApprovalLoading(lessonId);
    try {
      await apiFetch(`/api/canary-lessons/${lessonId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      toast.success(`Lesson ${action}d!`);
      fetchAllLessons();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update lesson');
    } finally {
      setApprovalLoading(null);
    }
  }

  async function handleSubscribe(lessonId: string) {
    if (subscribedIds.has(lessonId)) {
      toast('Already subscribed to this lesson');
      return;
    }
    try {
      await apiFetch('/api/canary-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      });
      toast.success('Subscribed successfully!');
      fetchSubscriptions();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to subscribe');
    }
  }

  const pendingLessons = allLessons.filter(l => l.status === 'pending');
  const approvedLessons = allLessons.filter(l => l.status === 'approved');

  return (
    <div className="min-h-screen bg-[#f6f5f4]">
      <header className="bg-white border-b border-black/10 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[#0075de]" />
          <span className="text-[15px] font-semibold text-black/90">LearnAI</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="text-[14px] font-medium">Marketplace</Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-[14px] font-medium text-[#615d59]"
            onClick={() => authClient.signOut().then(() => { window.location.href = '/'; })}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Sign out
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-black/10 bg-white" style={{boxShadow: 'rgba(0,0,0,0.04) 0px 4px 18px'}}>
            <CardContent className="pt-5">
              <div className="text-[28px] font-bold text-black/90">{allLessons.length}</div>
              <div className="text-[13px] text-[#615d59] mt-0.5">Total lessons</div>
            </CardContent>
          </Card>
          <Card className="border-black/10 bg-white" style={{boxShadow: 'rgba(0,0,0,0.04) 0px 4px 18px'}}>
            <CardContent className="pt-5">
              <div className="text-[28px] font-bold text-amber-600">{pendingLessons.length}</div>
              <div className="text-[13px] text-[#615d59] mt-0.5">Awaiting review</div>
            </CardContent>
          </Card>
          <Card className="border-black/10 bg-white" style={{boxShadow: 'rgba(0,0,0,0.04) 0px 4px 18px'}}>
            <CardContent className="pt-5">
              <div className="text-[28px] font-bold text-green-600">{approvedLessons.length}</div>
              <div className="text-[13px] text-[#615d59] mt-0.5">Live lessons</div>
            </CardContent>
          </Card>
          <Card className="border-black/10 bg-white" style={{boxShadow: 'rgba(0,0,0,0.04) 0px 4px 18px'}}>
            <CardContent className="pt-5">
              <div className="text-[28px] font-bold text-[#0075de]">{mySubscriptions.length}</div>
              <div className="text-[13px] text-[#615d59] mt-0.5">My subscriptions</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="bg-white border border-black/10 rounded-lg p-1">
            <TabsTrigger value="marketplace" className="text-[14px] font-medium rounded">
              <BookOpen className="h-4 w-4 mr-1.5" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="teach" className="text-[14px] font-medium rounded">
              <Plus className="h-4 w-4 mr-1.5" />
              Teach
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="text-[14px] font-medium rounded">
              <Users className="h-4 w-4 mr-1.5" />
              My learning
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-[14px] font-medium rounded">
              <ShieldCheck className="h-4 w-4 mr-1.5" />
              Admin queue
            </TabsTrigger>
          </TabsList>

          {/* Marketplace tab */}
          <TabsContent value="marketplace">
            <div className="space-y-4">
              <h2 className="text-[22px] font-bold text-black/90 tracking-[-0.25px]">Live lessons</h2>
              {loadingLessons ? (
                <div className="text-[14px] text-[#a39e98]">Loading lessons...</div>
              ) : approvedLessons.length === 0 ? (
                <Card className="border-black/10 bg-white">
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-8 w-8 text-[#a39e98] mx-auto mb-3" />
                    <p className="text-[14px] text-[#615d59]">No approved lessons yet. Be the first to teach!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {approvedLessons.map(lesson => (
                    <Card key={lesson.id} className="border-black/10 bg-white" style={{boxShadow: 'rgba(0,0,0,0.04) 0px 4px 18px'}}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-[16px] font-bold text-black/90 leading-snug">{lesson.title}</CardTitle>
                          <Badge className="shrink-0 rounded-full bg-[#f2f9ff] text-[#097fe8] text-xs border-0">{lesson.subject}</Badge>
                        </div>
                        <p className="text-[13px] text-[#615d59]">{lesson.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {lesson.aiSummary ? (
                          <div className="rounded-lg bg-[#f6f5f4] border border-black/8 p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Sparkles className="h-3 w-3 text-[#0075de]" />
                              <span className="text-[11px] font-semibold text-[#0075de] uppercase tracking-wider">AI Summary</span>
                            </div>
                            <p className="text-[12px] text-[#615d59] leading-relaxed">{lesson.aiSummary}</p>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[13px] w-full border-black/20"
                            onClick={() => handleAISummary(lesson.id)}
                            disabled={summaryLoading === lesson.id}
                          >
                            <Sparkles className="h-3 w-3 mr-1.5" />
                            {summaryLoading === lesson.id ? 'Generating...' : 'Generate AI summary'}
                          </Button>
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-black/8">
                          <span className="text-[13px] text-[#a39e98]">by {lesson.teacherName ?? 'Anonymous'}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[14px] font-bold text-black/90">
                              {parseFloat(String(lesson.price)) === 0 ? 'Free' : `$${parseFloat(String(lesson.price)).toFixed(2)}`}
                            </span>
                            <Button
                              size="sm"
                              className="bg-[#0075de] text-white hover:bg-[#005bab] text-[13px] rounded font-semibold"
                              onClick={() => handleSubscribe(lesson.id)}
                              disabled={subscribedIds.has(lesson.id)}
                            >
                              {subscribedIds.has(lesson.id) ? 'Subscribed' : 'Subscribe'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Teach tab */}
          <TabsContent value="teach">
            <Card className="border-black/10 bg-white max-w-2xl" style={{boxShadow: 'rgba(0,0,0,0.04) 0px 4px 18px'}}>
              <CardHeader>
                <CardTitle className="text-[20px] font-bold text-black/90">Submit a lesson</CardTitle>
                <p className="text-[14px] text-[#615d59]">Share your knowledge. Lessons are reviewed before going live.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateLesson} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-[13px] font-semibold text-black/80">Lesson title</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Introduction to Python lists"
                      className="border-black/20 text-[14px] rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-[13px] font-semibold text-black/80">Subject</Label>
                      <Input
                        id="subject"
                        value={form.subject}
                        onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        placeholder="e.g. Python"
                        className="border-black/20 text-[14px] rounded"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="price" className="text-[13px] font-semibold text-black/80">Price (USD)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        placeholder="0 for free"
                        className="border-black/20 text-[14px] rounded"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-[13px] font-semibold text-black/80">Short description</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="What will students learn from this lesson?"
                      rows={2}
                      className="border-black/20 text-[14px] rounded resize-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="content" className="text-[13px] font-semibold text-black/80">Full lesson content</Label>
                    <Textarea
                      id="content"
                      value={form.content}
                      onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                      placeholder="Write the full lesson content here..."
                      rows={8}
                      className="border-black/20 text-[14px] rounded resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={creating}
                    className="w-full bg-[#0075de] text-white hover:bg-[#005bab] font-semibold rounded"
                  >
                    {creating ? 'Submitting...' : 'Submit lesson for review'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions tab */}
          <TabsContent value="subscriptions">
            <div className="space-y-4">
              <h2 className="text-[22px] font-bold text-black/90 tracking-[-0.25px]">My learning</h2>
              {loadingSubs ? (
                <div className="text-[14px] text-[#a39e98]">Loading subscriptions...</div>
              ) : mySubscriptions.length === 0 ? (
                <Card className="border-black/10 bg-white">
                  <CardContent className="py-12 text-center">
                    <Users className="h-8 w-8 text-[#a39e98] mx-auto mb-3" />
                    <p className="text-[14px] text-[#615d59] mb-3">No subscriptions yet.</p>
                    <Link href="/marketplace">
                      <Button size="sm" className="bg-[#0075de] text-white hover:bg-[#005bab] rounded">Browse lessons</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {mySubscriptions.map(sub => (
                    <Card key={sub.id} className="border-black/10 bg-white" style={{boxShadow: 'rgba(0,0,0,0.04) 0px 4px 18px'}}>
                      <CardContent className="py-4 flex items-center justify-between">
                        <div>
                          <div className="text-[15px] font-semibold text-black/90">{sub.lessonTitle ?? 'Untitled'}</div>
                          <div className="text-[13px] text-[#615d59]">{sub.lessonSubject} &mdash; {sub.lessonPrice && parseFloat(sub.lessonPrice) > 0 ? `$${parseFloat(sub.lessonPrice).toFixed(2)}` : 'Free'}</div>
                        </div>
                        <StatusBadge status={sub.status} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Admin queue tab */}
          <TabsContent value="admin">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[22px] font-bold text-black/90 tracking-[-0.25px]">Review queue</h2>
                <Badge className="rounded-full bg-amber-50 text-amber-700 border-amber-200 text-xs font-semibold">
                  {pendingLessons.length} pending
                </Badge>
              </div>
              {loadingLessons ? (
                <div className="text-[14px] text-[#a39e98]">Loading queue...</div>
              ) : pendingLessons.length === 0 ? (
                <Card className="border-black/10 bg-white">
                  <CardContent className="py-12 text-center">
                    <ShieldCheck className="h-8 w-8 text-green-500 mx-auto mb-3" />
                    <p className="text-[14px] text-[#615d59]">Queue is clear — no lessons awaiting review.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingLessons.map(lesson => (
                    <Card key={lesson.id} className="border-black/10 bg-white" style={{boxShadow: 'rgba(0,0,0,0.04) 0px 4px 18px'}}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <CardTitle className="text-[16px] font-bold text-black/90">{lesson.title}</CardTitle>
                            <p className="text-[13px] text-[#615d59] mt-0.5">by {lesson.teacherName ?? lesson.teacherEmail ?? 'Unknown'} &bull; {lesson.subject}</p>
                          </div>
                          <StatusBadge status={lesson.status} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-[13px] text-[#615d59] leading-relaxed">{lesson.description}</p>
                        <div className="rounded-lg bg-[#f6f5f4] border border-black/8 p-3 max-h-32 overflow-y-auto">
                          <p className="text-[12px] text-[#615d59] font-mono leading-relaxed whitespace-pre-wrap">{lesson.content?.slice(0, 500)}{(lesson.content?.length ?? 0) > 500 ? '...' : ''}</p>
                        </div>
                        {!lesson.aiSummary && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[13px] border-black/20"
                            onClick={() => handleAISummary(lesson.id)}
                            disabled={summaryLoading === lesson.id}
                          >
                            <Sparkles className="h-3 w-3 mr-1.5" />
                            {summaryLoading === lesson.id ? 'Generating...' : 'Generate AI summary'}
                          </Button>
                        )}
                        {lesson.aiSummary && (
                          <div className="rounded-lg bg-[#f2f9ff] border border-[#c3e4fb] p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Sparkles className="h-3 w-3 text-[#0075de]" />
                              <span className="text-[11px] font-semibold text-[#0075de] uppercase tracking-wider">AI Summary</span>
                            </div>
                            <p className="text-[12px] text-[#615d59]">{lesson.aiSummary}</p>
                          </div>
                        )}
                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white text-[13px] rounded font-semibold"
                            onClick={() => handleApproval(lesson.id, 'approve')}
                            disabled={approvalLoading === lesson.id}
                          >
                            {approvalLoading === lesson.id ? 'Processing...' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="text-[13px] rounded font-semibold"
                            onClick={() => handleApproval(lesson.id, 'reject')}
                            disabled={approvalLoading === lesson.id}
                          >
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
