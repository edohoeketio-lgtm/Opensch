"use server";
import prisma from '@/lib/prisma';
import { calculateRiskLevel } from '@/lib/risk_engine';
import { getAuthenticatedUser } from '@/lib/auth';
import { TelemetryLog, GradeRecord, StudentTelemetryPayload } from '@/app/types/telemetry';

export async function getStudentTelemetry(studentId: string): Promise<StudentTelemetryPayload> {
  // If the DB server is unreachable locally, return an empty payload to avoid crashing the CRM
  try {
    const caller = await getAuthenticatedUser();
    if (!caller) throw new Error("Unauthorized access to telemetry");
    if (caller.role === 'STUDENT' && caller.id !== studentId) {
      throw new Error("Forbidden. Students can only view their own telemetry.");
    }
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        progressStates: {
          include: { lesson: true }
        },
        submissions: {
          include: { assignment: true }
        }
      }
    });

    if (!student) throw new Error("Student not found");

    const telemetry: TelemetryLog[] = student.progressStates.map((state: any) => ({
      lesson: state.lesson.title,
      watched: state.watchedSeconds,
      total: state.lesson.order * 100, // naive duration mock
      status: state.isCompleted ? 'completed' : (state.watchedSeconds < 10 ? 'skipped' : 'in_progress')
    }));

    const grades: GradeRecord[] = student.submissions.map((sub: any) => ({
      sprint: sub.assignment.prompt.slice(0, 20) + '...',
      score: sub.aiConfidenceScore || 0,
      arch: sub.aiConfidenceScore && sub.aiConfidenceScore > 80 ? 'Pass' : 'Needs Work',
      date: sub.updatedAt.toLocaleDateString()
    }));

    return {
      telemetry,
      grades,
      notes: "No internal faculty notes available for this student."
    };
  } catch (error) {
    console.error("Failed to load real DB telemetry for student.", error);
    // Return graceful empty payload on DB absence
    return { telemetry: [], grades: [], notes: "" };
  }
}
