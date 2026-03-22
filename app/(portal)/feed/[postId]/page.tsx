import { MessageSquare, Target, Award, ArrowUpRight, CheckCircle2, HelpCircle, BookOpen, Video, Link as LinkIcon, ChevronUp, ChevronDown, Flame, Calendar, Users, ArrowLeft, MoreHorizontal, CornerDownRight, Code, Github, BarChart2, Bell } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getAvatarColor } from '@/lib/utils';
import { getAuthenticatedUser } from '@/lib/auth';
import { ThreadReplies } from './ThreadReplies';
import { PostFooterActions } from './PostFooterActions';
import { InteractivePoll } from '../InteractivePoll';
import Image from 'next/image';

const CATEGORY_META_MAP: Record<string, any> = {
  'Announcement': { icon: Bell, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  'Deliverable': { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  'Question': { icon: HelpCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  'Win': { icon: Award, color: 'text-[#B08D57]', bg: 'bg-[#B08D57]/10' },
  'Feedback': { icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  'Resource': { icon: LinkIcon, color: 'text-[#9CA3AF]', bg: 'bg-white/5' },
  'General': { icon: MessageSquare, color: 'text-[#9CA3AF]', bg: 'bg-white/5' }
};

export default async function ThreadViewPage({ params }: { params: Promise<{ postId: string }> }) {
  const resolvedParams = await params;
  const { postId } = resolvedParams;

  const currentUser = await getAuthenticatedUser();
  const isAdmin = currentUser?.role === 'ADMIN';

    let post: any = null;
  let initialComments: any[] = [];
  let Icon: any = null;

  const dbThread = await prisma.thread.findUnique({
    where: { id: postId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { include: { profile: true } } }
      }
    }
  });

  let canDeleteThread = false;

  if (dbThread && dbThread.messages.length > 0) {
    const opMessage = dbThread.messages[0];
    const opAuthor = opMessage.sender;
    canDeleteThread = isAdmin || opAuthor.id === currentUser?.id;
    const opPayload = opMessage.payload as any || {};
    const typeMeta = CATEGORY_META_MAP[dbThread.category] || CATEGORY_META_MAP['General'];
    Icon = typeMeta.icon || MessageSquare;

    post = {
      id: dbThread.id,
      type: dbThread.category,
      threadId: dbThread.id,
      user: {
        name: (opAuthor as any).name || (opAuthor.email ? opAuthor.email.split('@')[0] : 'Unknown'),
        initial: (opAuthor as any).name?.[0]?.toUpperCase() || opAuthor.email?.[0]?.toUpperCase() || 'U',
        role: opAuthor.role === 'INSTRUCTOR' ? 'Instructor' : 'Student',
      },
      time: new Date(dbThread.createdAt).toLocaleDateString(),
      title: dbThread.title,
      content: opMessage.content,
      icon: Icon,
      color: typeMeta.color,
      bg: typeMeta.bg,
      upvotes: dbThread.upvotes || 0,
      hasVoted: false,
      image: opPayload.image,
      video: opPayload.video,
      codeSnippet: opPayload.codeSnippet,
      repoUrl: opPayload.repoUrl,
      poll: opPayload.poll,
    };

    initialComments = dbThread.messages.slice(1).map((msg: any) => {
      const author = msg.sender;
      return {
        id: msg.id,
        author: (author as any).name || (author.email ? author.email.split('@')[0] : 'Unknown'),
        role: author.role === 'INSTRUCTOR' ? 'Instructor' : 'Student',
        initial: (author as any).name?.[0]?.toUpperCase() || author.email?.[0]?.toUpperCase() || 'U',
        time: new Date(msg.createdAt).toLocaleDateString(),
        content: msg.content,
        canDelete: isAdmin || author.id === currentUser?.id,
        upvotes: msg.upvotes || 0,
        hasVoted: false
      };
    });
  } else {
    // Fallback: Check if it exists in the Broadcast table (Announcements)
    let dbBroadcast: any = await prisma.broadcast.findUnique({
      where: { id: postId },
      include: {
        thread: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
              include: { sender: { include: { profile: true } } }
            }
          }
        }
      } as any
    });

    if (!dbBroadcast) {
      notFound();
    }

    // Auto-create a thread for this broadcast if it doesn't have one yet
    const rawBroadcast: any = dbBroadcast;
    if (!rawBroadcast.thread) {
      const newThread = await prisma.thread.create({
        data: {
          title: `Discussion: ${dbBroadcast.title}`,
          category: 'Announcement',
          broadcast: {
            connect: { id: dbBroadcast.id }
          }
        } as any,
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            include: { sender: { include: { profile: true } } }
          }
        }
      });
      // We mutate the local object so the rest of the flow sees the new thread
      dbBroadcast = { ...dbBroadcast, thread: newThread };
    }

    const typeMeta = CATEGORY_META_MAP['Announcement'] || CATEGORY_META_MAP['General'];
    Icon = typeMeta.icon || Bell;

    const currentBroadcast: any = dbBroadcast;

    post = {
      id: currentBroadcast.id,
      type: 'Announcement',
      threadId: currentBroadcast.thread?.id,
      user: {
        name: 'OpenSch Administration',
        initial: 'OS',
        role: 'SYSTEM',
      },
      time: new Date(currentBroadcast.createdAt).toLocaleDateString(),
      title: currentBroadcast.title,
      content: currentBroadcast.content,
      icon: Icon,
      color: typeMeta.color || 'text-[#B08D57]',
      bg: typeMeta.bg || 'bg-[#B08D57]/10',
      upvotes: 0,
      hasVoted: false,
    };

    if (currentBroadcast.thread && currentBroadcast.thread.messages) {
      initialComments = currentBroadcast.thread.messages.map((msg: any) => {
        const author = msg.sender;
        return {
          id: msg.id,
          author: (author as any).name || (author.email ? author.email.split('@')[0] : 'Unknown'),
          role: author.role === 'INSTRUCTOR' ? 'Instructor' : 'Student',
          initial: (author as any).name?.[0]?.toUpperCase() || author.email?.[0]?.toUpperCase() || 'U',
          time: new Date(msg.createdAt).toLocaleDateString(),
          content: msg.content
        };
      });
    }
  }



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
                  <div 
                    className="w-12 h-12 rounded-full border border-[#2D2D2D] flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: getAvatarColor(post.user.initial) }}
                  >
                    <span className="text-[#FFFFFF] font-bold text-lg">{post.user.initial}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-base font-bold text-[#FFFFFF] tracking-tight">{post.user.name}</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-[#2D2D2D] text-[9px] font-semibold uppercase tracking-[0.1em] text-[#888888]">
                        {post.user.role}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md ${post.bg} border border-[#2D2D2D] text-[9px] font-bold uppercase tracking-[0.15em] ${post.color}`}>
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

              {!(post.title === "Untitled Thought" || post.content.startsWith(post.title.replace("...", ""))) && (
                <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] tracking-tight mb-5 leading-snug">{post.title}</h1>
              )}
              
              <div className="prose prose-invert max-w-none text-[#9CA3AF] text-[16px] leading-relaxed mb-4 [&>p]:text-[#D1D5DB]">
                 {post.content.split('\n').map((para: string, i: number) => (
                   <p key={i}>{para}</p>
                 ))}
              </div>

              {post.image && (
                <div className="mt-4 mb-4 rounded-xl overflow-hidden border border-[#2D2D2D]">
                  <Image width={600} height={600} src={post.image} alt="Attached" className="w-full max-h-[500px] object-cover" />
                </div>
              )}
              {post.video && (
                <div className="mt-4 mb-4 rounded-xl overflow-hidden border border-[#2D2D2D] bg-black">
                  <video src={post.video} controls className="w-full max-h-[500px]" />
                </div>
              )}
              {post.codeSnippet && (
                <div className="mt-4 mb-4 rounded-xl overflow-hidden border border-[#2D2D2D] bg-[#111111]">
                  <div className="flex items-center px-4 py-2 border-b border-[#2D2D2D] bg-white/[0.02]">
                    <Code className="w-3.5 h-3.5 text-[#888888] mr-2" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#888888]">code snippet</span>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <pre className="text-[14px] text-[#E5E7EB] font-mono leading-relaxed break-words whitespace-pre-wrap">
                      <code>{post.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              )}
              {post.repoUrl && (
                <div className="mt-4 mb-4 rounded-xl overflow-hidden border border-[#2D2D2D] bg-[#111111] flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                    <Github className="w-5 h-5 text-[#FFFFFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold text-[#FFFFFF] truncate">{post.repoUrl.replace('https://github.com/', '')}</h4>
                    <Link href={post.repoUrl} target="_blank" className="text-xs text-[#888888] truncate mt-0.5 hover:text-[#FFFFFF] transition-colors">{post.repoUrl}</Link>
                  </div>
                </div>
              )}
              {post.poll && (
                <InteractivePoll question={post.poll.question} options={post.poll.options} isFeedView={false} threadId={post.threadId || post.id} />
              )}

              {/* OP Footer Actions */}
              <div className="mt-8">
                <PostFooterActions threadId={post.threadId || post.id} upvotes={post.upvotes} hasVoted={post.hasVoted} repliesCount={initialComments.length} canDelete={canDeleteThread} />
              </div>
            </div>
          </div>
        </div>

        <div id="replies">
          {post.threadId ? (
            <ThreadReplies initialComments={initialComments} threadId={post.threadId} />
          ) : (
             <div className="mt-8 pt-8 border-t border-[#2D2D2D] text-center">
               <div className="inline-flex w-16 h-16 rounded-full bg-white/[0.02] border border-[#2D2D2D] items-center justify-center mb-4">
                 <Bell className="w-6 h-6 text-[#525252]" />
               </div>
               <p className="text-[#888888] text-[15px] max-w-[300px] mx-auto leading-relaxed">
                 This is an official campus announcement. Replies are not enabled.
               </p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
