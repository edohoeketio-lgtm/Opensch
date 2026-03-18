import prisma from '@/lib/prisma';
import ReviewQueueClient from './ReviewQueueClient';

export default async function AIReviewQueuePage() {
  // Fetch pending triage items ordered by oldest first (to surface SLA breaches)
  const submissions = await prisma.submission.findMany({
    where: {
      status: {
        in: ['PENDING', 'AI_DRAFTED', 'IN_REVIEW', 'REVISIONS_REQUESTED']
      }
    },
    include: {
      student: {
        include: {
          profile: true,
          cohort: true
        }
      },
      assignment: {
        include: {
          lesson: true
        }
      }
    },
    orderBy: {
      submittedAt: 'asc'
    }
  });

  // Map Prisma data to our unified CRM interface
  const mappedSubmissions = submissions.map(sub => {
    // Determine status logic based on SubmissionStatus enum
    // Custom mapping for the UI states
    let uiStatus = 'pending_ai';
    if (sub.status === 'AI_DRAFTED') uiStatus = 'draft_review';
    else if (sub.status === 'IN_REVIEW') uiStatus = 'draft_review';
    else if (sub.status === 'REVISIONS_REQUESTED') uiStatus = 'graded'; // show as done but requires revisions

    // Calculate SLA aging
    const hoursSinceSubmission = Math.floor((Date.now() - sub.submittedAt.getTime()) / (1000 * 60 * 60));
    const slaText = hoursSinceSubmission > 24 
      ? `SLA BREACHED (${hoursSinceSubmission}h delay)` 
      : `${hoursSinceSubmission}h ago`;

    return {
      id: sub.id,
      studentName: sub.student.profile?.fullName || sub.student.email,
      cohort: sub.student.cohort?.name || 'Unassigned Cohort',
      sprint: sub.assignment.lesson.title || 'Unknown Sprint',
      status: uiStatus,
      submittedAt: slaText,
      repoUrl: sub.contentUrlOrCode,
      // Default to empty or map from AI rationale if existed
      aiScore: sub.aiScore || null,
      aiConfidenceScore: sub.aiConfidenceScore || null,
      aiAnalysis: sub.aiRationale || null,
      
      // Keep UI fallbacks for structural fields not tracked natively in this schema version
      aiFlags: 0,
      aiArchQuality: 'Pending',
      aiPrimaryEntrypoints: [],
      aiFeedback: ''
    };
  });

  return <ReviewQueueClient initialSubmissions={mappedSubmissions} />;
}
