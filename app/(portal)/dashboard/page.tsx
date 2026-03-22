import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import DashboardClient from './DashboardClient';

const formatRelativeTime = (date: Date) => {
  const diffInMinutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
};

const formatUpcomingTime = (date: Date) => {
  const diffInMinutes = Math.floor((date.getTime() - new Date().getTime()) / 60000);
  if (diffInMinutes < 0) return 'Passed';
  if (diffInMinutes < 60) return `In ${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''}`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `In ${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `In ${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ studentId?: string }> }) {
  const params = await searchParams;
  let studentName = null;
  let impersonating = false;
  let milestone = { title: 'Getting Started', subtitle: 'Complete a module to earn.' };
  let honor = { title: 'Live Attendee', subtitle: '0% Session Presence' };
  let recentActivity: any[] = [];
  let upcomingAssignment = null;
  let upcomingEvent = null;
  let targetUserId: string | null = null;
  try {
    if (params.studentId) {
      impersonating = true;
      targetUserId = params.studentId;
      const student = await prisma.user.findUnique({
        where: { id: params.studentId },
        include: { profile: true }
      });
      if (student) {
        studentName = student.profile?.isPublic ? student.email.split('@')[0] : 'Private Student';
      } else {
        studentName = `Mock Student [${params.studentId}]`;
      }
    } else {
      const user = await getAuthenticatedUser();
      if (user) {
        targetUserId = user.id;
        const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
        studentName = profile?.fullName || "Scholar";
      }
    }

    if (targetUserId) {
      // 1. Calculate Honor metrics from Event and EventRSVPs
      const totalPastEvents = await prisma.event.count({
        where: {
          endTime: { lt: new Date() },
          type: 'LIVE_LECTURE'
        }
      });
      
      const attendedEvents = await prisma.eventRSVP.count({
        where: {
          userId: targetUserId,
          status: 'ATTENDING',
          event: { endTime: { lt: new Date() }, type: 'LIVE_LECTURE' }
        }
      });
      
      honor.subtitle = totalPastEvents > 0 
        ? `${Math.round((attendedEvents / totalPastEvents) * 100)}% Session Presence`
        : "No sessions yet";
        
      if (totalPastEvents > 0 && attendedEvents === totalPastEvents) {
         honor.title = "Perfect Attendance";
      }

      // 2. Calculate Milestone metrics directly from module progress
      const allModules = await prisma.module.findMany({
        where: { isPublished: true },
        include: { sections: { include: { lessons: { where: { isPublished: true }, select: { id: true } } } } }
      });
      
      const userProgress = await prisma.progressState.findMany({
        where: { userId: targetUserId, isCompleted: true },
        select: { lessonId: true }
      });
      
      const completedLessonIds = new Set(userProgress.map(p => p.lessonId));
      
      let masteredCount = 0;
      let latestMasteredTitle = "Getting Started";
      for (const mod of allModules) {
        const modLessons = mod.sections.flatMap((s: any) => s.lessons);
        if (modLessons.length > 0 && modLessons.every((l: any) => completedLessonIds.has(l.id))) {
          masteredCount++;
          latestMasteredTitle = mod.title;
        }
      }
      
      if (masteredCount > 0) {
        milestone.title = `Mastered (${masteredCount})`;
        milestone.subtitle = latestMasteredTitle;
      }
    }

    // 3. Fetch Recent Cohort Activity (Threads)
    try {
      const dbThreads = await prisma.thread.findMany({
        where: { targetType: 'CAMPUS' },
        take: 2,
        orderBy: { createdAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 1,
            include: { sender: { include: { profile: true } } }
          }
        }
      });

      recentActivity = dbThreads.map(t => {
        const firstMessage = t.messages[0];
        const author = firstMessage?.sender;
        return {
          id: t.id,
          authorName: author?.profile?.fullName || (author?.email ? author.email.split('@')[0] : 'Unknown'),
          authorAvatar: author?.profile?.avatarUrl,
          authorInitial: author?.profile?.fullName?.[0]?.toUpperCase() || author?.email?.[0]?.toUpperCase() || 'U',
          title: t.title,
          timeLabel: formatRelativeTime(new Date(t.createdAt)),
          type: t.category
        };
      });
    } catch (e) {
      console.warn("Failed to fetch recent activity", e);
    }

    // 4. Fetch Next Assignment for Needs Attention
    try {
      const nextAssignmentRaw = await prisma.assignment.findFirst({
         orderBy: { createdAt: 'asc' },
         include: { lesson: { include: { section: { include: { module: { include: { course: true } } } } } } } as any,
         where: {
           submissions: {
              none: { studentId: targetUserId as string, status: 'PASSED' }
           }
         } as any
      });
      
      const nextAssignment = nextAssignmentRaw as any;
      if (nextAssignment && nextAssignment.lesson) {
        const courseSlug = nextAssignment.lesson.section?.module?.course?.slug;
        upcomingAssignment = {
           title: nextAssignment.lesson.title + " Deliverable",
           description: `Submit your work for ${nextAssignment.lesson.title}.`,
           url: `/course/${courseSlug}/module/${nextAssignment.lesson.section?.moduleId}/lesson/${nextAssignment.lesson.id}`,
           deadlineText: "Next Up"
        };
      }
    } catch (e) { console.warn("Failed to fetch next assignment", e); }

    // 5. Fetch Next Live Event for Needs Attention
    try {
      const nextEvent = await prisma.event.findFirst({
        where: { startTime: { gt: new Date() } },
        orderBy: { startTime: 'asc' }
      });
      
      if (nextEvent) {
        upcomingEvent = {
           title: nextEvent.title,
           description: nextEvent.description || "Join the upcoming live session.",
           url: nextEvent.link || "#",
           timeText: nextEvent.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
           timeLabel: formatUpcomingTime(nextEvent.startTime)
        };
      }
    } catch (e) { console.warn("Failed to fetch next event", e); }

  } catch (error) {
    if (params.studentId) {
      impersonating = true;
      studentName = 'Alex Thompson (Mock)';
    }
    console.error("Dashboard error:", error);
  }

  let currentCohortWeek = 1;
  let progressMetrics = {
    mastery: 0,
    timeSpentHrs: 0,
    points: 0,
    moduleProgress: [] as Array<{ title: string, completedLessons: number, totalLessons: number }>
  };

  try {
    const settings = await prisma.globalSettings.findFirst();
    if (settings) {
      currentCohortWeek = (settings as any).currentCohortWeek || 1;
    }

    // Try to get real progress from the course
    const course = await prisma.course.findFirst({
      include: {
        modules: {
          include: {
            sections: {
              include: { lessons: { orderBy: { order: 'asc' } } },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (course && targetUserId) {
      const progressStates = await prisma.progressState.findMany({
        where: { userId: targetUserId }
      });

      let totalActiveLessons = 0;
      let totalCompletedActiveLessons = 0;
      let totalWatchedSeconds = 0;

      // We need to map the active week's modules from content.ts to DB modules.
      // Easiest heuristic: match them by order in the current week, or just take the DB modules directly.
      // We will pull the corresponding modules for the active week based on the static defined structure if possible, 
      // but without a hardlink, let's just use the DB modules sequentially. Assuming each week has ~2 modules.
      // Let's just calculate total course progress for the mastery, or focus on the active week's modules.
      // For now, let's just map all DB modules to the moduleProgress array.
      const activeWeekLength = 2; // Roughly 2 modules per week
      const startIndex = (currentCohortWeek - 1) * activeWeekLength;
      const weekDbModules = course.modules.slice(startIndex, startIndex + activeWeekLength);

      progressMetrics.moduleProgress = weekDbModules.map((mod: any) => {
        const modLessons = mod.sections.flatMap((s: any) => s.lessons);
        const totalLessons = modLessons.length;
        const completedLessons = modLessons.filter((l: any) => progressStates.find(p => p.lessonId === l.id && p.isCompleted)).length;
        totalActiveLessons += totalLessons;
        totalCompletedActiveLessons += completedLessons;
        return {
          title: mod.title,
          completedLessons,
          totalLessons
        };
      });

      totalWatchedSeconds = progressStates.reduce((acc, p) => acc + (p.watchedSeconds || 0), 0);
      progressMetrics.timeSpentHrs = Math.round((totalWatchedSeconds / 3600) * 10) / 10;
      progressMetrics.mastery = totalActiveLessons === 0 ? 0 : Math.round((totalCompletedActiveLessons / totalActiveLessons) * 100);
      progressMetrics.points = totalCompletedActiveLessons * 10; // 10 points per lesson
    }
  } catch (e) {
    console.error("Failed to fetch global settings or progress", e);
  }

  // Fallback to static data if no DB modules exist for this week
  if (progressMetrics.moduleProgress.length === 0) {
     const { CURRICULUM_WEEKS } = await import('@/lib/content');
     const activeWeekData = CURRICULUM_WEEKS.find(w => w.number === currentCohortWeek) || CURRICULUM_WEEKS[0];
     progressMetrics.moduleProgress = activeWeekData.modules.map(mod => ({
        title: mod.title,
        completedLessons: 0,
        totalLessons: mod.lessons.length // Static lessons array
     }));
  }
  
  let resumeUrl = `/course/ai-product-builder/module/${currentCohortWeek}/lesson/1`;
  try {
     const course = await prisma.course.findFirst({
         include: {
            modules: { include: { sections: { include: { lessons: { orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } } }, orderBy: { order: 'asc' } }
         }
     });
     
     if (course && targetUserId) {
        const pStates = await prisma.progressState.findMany({ where: { userId: targetUserId }});
        let foundResume = false;
        const studentQuery = params.studentId ? `?studentId=${params.studentId}` : '';
        for (const mod of course.modules) {
           for (const sec of mod.sections) {
              for (const less of sec.lessons) {
              const state = pStates.find(p => p.lessonId === less.id);
              if (!state || !state.isCompleted) {
                 resumeUrl = `/course/${course.slug}/module/${mod.id}/lesson/${less.id}${studentQuery}`;
                 foundResume = true;
                 break;
              }
              }
              if (foundResume) break;
           }
           if (foundResume) break;
        }
        
        if (!foundResume && course.modules.length > 0) {
           const lastMod = course.modules[course.modules.length - 1];
           if (lastMod.sections.length > 0) {
              const lastSec = lastMod.sections[lastMod.sections.length - 1];
              if (lastSec.lessons.length > 0) {
                 const lastLess = lastSec.lessons[lastSec.lessons.length - 1];
                 resumeUrl = `/course/${course.slug}/module/${lastMod.id}/lesson/${lastLess.id}${studentQuery}`;
              }
           }
        }
     }
  } catch(e) { console.error(e); }

  return (
    <DashboardClient 
      studentName={studentName} 
      isImpersonating={impersonating} 
      studentId={params.studentId || null} 
      milestone={milestone}
      honor={honor}
      recentActivity={recentActivity}
      upcomingAssignment={upcomingAssignment}
      upcomingEvent={upcomingEvent}
      currentWeek={currentCohortWeek}
      progressMetrics={progressMetrics}
      resumeUrl={resumeUrl}
    />
  );
}
