import RosterClient, { StudentRecord } from './RosterClient';
import prisma from '@/lib/prisma';
import { getStudentTelemetry } from '@/app/actions/studentTelemetry';

export default async function RosterPage() {
  let initialStudents: StudentRecord[] = [];

  try {
    // Attempt to pull real lightweight telemtry representations from DB
    const dbUsers = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        profile: true,
        enrollments: true
      }
    });

    if (dbUsers.length > 0) {
      initialStudents = dbUsers.map((user: any) => {
        const enrollment = user.enrollments?.[0]; // Default to first enrollment logic for now
        
        return {
          id: user.id,
          name: user.profile?.isPublic ? (user.email.split('@')[0] || 'Unknown Student') : (user.email.split('@')[0] || 'Private Student'),
          email: user.email,
          cohort: 'Spring 25', // Should map to Course title dynamically
          progress: enrollment ? enrollment.cachedProgress : 0,
          risk: enrollment ? (enrollment.riskStatus as any) : 'medium',
          lastActive: enrollment ? new Date(enrollment.lastActiveAt).toLocaleDateString() : 'Unknown',
          avatar: user.email.substring(0, 2).toUpperCase()
        };
      });
    } else {
      throw new Error("No students in DB, invoking fallback.");
    }
  } catch (error) {
    // Graceful fallback for local dev when DB is missing or empty
    // Protects visual stability for UI design iteration
    initialStudents = [
      { 
        id: '1', name: 'Alex Thompson', email: 'alex@example.com', cohort: 'Spring 25', progress: 85, risk: 'low', lastActive: '2 hours ago', avatar: 'AT',
        telemetry: [
          { lesson: 'Intro to React', watched: 1200, total: 1200, status: 'completed' },
          { lesson: 'State Management', watched: 900, total: 900, status: 'completed' }
        ],
        grades: [
          { sprint: 'Sprint 1: UI Foundations', score: 95, arch: 'Pass', date: 'Oct 12' },
          { sprint: 'Sprint 2: Global State', score: 92, arch: 'Pass', date: 'Oct 26' }
        ],
        notes: "Consistently excellent. Might be worth asking to TA next cohort."
      },
      { 
        id: '2', name: 'Sarah Chen', email: 'sarah.c@example.com', cohort: 'Spring 25', progress: 42, risk: 'high', lastActive: '5 days ago', avatar: 'SC',
        telemetry: [
          { lesson: 'Intro to React', watched: 1200, total: 1200, status: 'completed' },
          { lesson: 'State Management', watched: 45, total: 900, status: 'skipped' }, 
          { lesson: 'Server Components', watched: 10, total: 1500, status: 'skipped' }
        ],
        grades: [
          { sprint: 'Sprint 1: UI Foundations', score: 88, arch: 'Pass', date: 'Oct 12' },
          { sprint: 'Sprint 2: Global State', score: 65, arch: 'Needs Work', date: 'Oct 26' }
        ],
        notes: "Falling behind. Skipping video lectures entirely and attempting to brute-force the deliverables. Reached out via email on Nov 2."
      },
      { id: '3', name: 'Marcus Johnson', email: 'marcus.j@example.com', cohort: 'Fall 24', progress: 100, risk: 'low', lastActive: '1 week ago', avatar: 'MJ' },
      { id: '4', name: 'Elena Rodriguez', email: 'elena.r@example.com', cohort: 'Spring 25', progress: 68, risk: 'medium', lastActive: '1 day ago', avatar: 'ER' },
      { id: '5', name: 'David Kim', email: 'david.k@example.com', cohort: 'Spring 25', progress: 15, risk: 'high', lastActive: '2 weeks ago', avatar: 'DK' },
    ];
  }

  return <RosterClient initialStudents={initialStudents} getStudentTelemetry={getStudentTelemetry} />;
}
