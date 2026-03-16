import { MessageSquare, Target, Award, ArrowUpRight, CheckCircle2, HelpCircle, BookOpen, Video, Link as LinkIcon, ChevronUp, ChevronDown, Flame, Calendar, Users, ArrowLeft, MoreHorizontal, CornerDownRight } from 'lucide-react';
import Link from 'next/link';
import { ThreadReplies } from './ThreadReplies';
import { PostFooterActions } from './PostFooterActions';

export default async function ThreadViewPage({ params }: { params: Promise<{ postId: string }> }) {
  const resolvedParams = await params;
  const { postId } = resolvedParams;
  // In a real app, fetch post by ID. Mocking Marcus T's post for now to match the CEO Review feedback.
  const post = {
    id: 4,
    type: "question",
    user: { name: "Marcus T.", initial: "M", role: "Basic" },
    time: "1 day ago",
    title: "Q: Supabase Row Level Security (RLS) policies giving 403s",
    content: "Has anyone run into an issue where standard authenticated users are getting 403 Forbidden errors when trying to read from the public.profiles table? I set up the policies according to the sprint guide.",
    icon: HelpCircle,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    upvotes: 8,
    hasVoted: false
  };

  return (
    <div className="flex-1 overflow-y-auto bg-transparent relative flex flex-col">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-20 bg-[#111111]/80 backdrop-blur-md border-b border-[#2D2D2D] px-8 py-4 flex items-center justify-between">
        <Link href="/feed" className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors group">
          <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Back to Forum</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto w-full px-6 md:px-8 py-10 flex-1">
        
        {/* OP Post (Expanded) */}
        <div className="mb-10 pb-8 border-b border-[#2D2D2D] relative">
          <div className="flex flex-col">

            {/* Main OP Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-[#2D2D2D] bg-[#1C1C1E] flex items-center justify-center overflow-hidden">
                    <span className="text-[#FFFFFF] font-bold text-lg">{post.user.initial}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-base font-bold text-[#FFFFFF] tracking-tight">{post.user.name}</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-[#2D2D2D] text-[9px] font-semibold uppercase tracking-[0.1em] text-[#888888]">
                        {post.user.role}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold uppercase tracking-[0.15em] text-blue-400">
                        OP
                      </span>
                    </div>
                    <span className="text-sm text-[#888888] font-medium">{post.time}</span>
                  </div>
                </div>
                <button className="p-2 text-[#888888] hover:text-[#FFFFFF] transition-colors rounded-lg hover:bg-white/5">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] tracking-tight mb-5 leading-snug">{post.title}</h1>
              
              <div className="prose prose-invert max-w-none text-[#9CA3AF] text-[16px] leading-relaxed mb-8 [&>p]:text-[#D1D5DB]">
                 <p>{post.content}</p>
                 <p className="mt-5">Here is the policy I used:</p>
                 <pre className="mt-5 p-4 rounded-xl bg-[#1C1C1E] border border-[#2D2D2D] text-sm text-[14px] font-mono text-emerald-400 whitespace-pre-wrap break-words">
                   <code>
                     CREATE POLICY "Enable read access for all users" ON "public"."profiles"
                     AS PERMISSIVE FOR SELECT
                     TO public
                     USING (true);
                   </code>
                 </pre>
              </div>

              {/* OP Footer Actions */}
              <PostFooterActions upvotes={post.upvotes} hasVoted={post.hasVoted} />
            </div>
          </div>
        </div>

        <div id="replies">
          <ThreadReplies initialComments={[
          {
            id: '1',
            author: 'OpenSch Staff',
            role: 'Instructor',
            avatarChar: 'O',
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            time: '18 hours ago',
            content: 'Hey Marcus. Make sure you set the policy to apply to the `authenticated` role specifically, not the `anon` role. If you use `TO public`, it applies to anon users too, which might cause conflicts if you have another policy overriding it. Check if RLS is actually enabled on the table first using the GUI toggle.',
            upvotes: 12,
            hasVoted: false,
            replies: [
              {
                id: '2',
                author: 'Marcus T.',
                role: 'OP',
                avatarChar: 'M',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                time: '17 hours ago',
                content: 'Ah, that was it! I forgot to check the box to actually enable RLS before adding the policies. Facepalm. Thank you Maurice!',
                upvotes: 3,
                hasVoted: false,
                replies: []
              }
            ]
          },
          {
            id: '3',
            author: 'Sarah J.',
            role: 'Premium',
            avatarChar: 'S',
            color: 'text-[#888888]',
            bg: 'bg-white/5',
            time: '14 hours ago',
            content: 'Glad you got it fixed! Just a tip - I usually write my policies via the SQL editor rather than the GUI, it makes it easier to copy-paste them into your migration tracking files later if you\'re building a production app.',
            upvotes: 7,
            hasVoted: false,
            replies: []
          }
        ]} />
        </div>
      </div>
    </div>
  );
}
