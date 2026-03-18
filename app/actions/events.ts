"use server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { EventType, RSVPStatus, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Validates that the active session has Admin or Instructor privileges.
 */
async function verifyAdminOrInstructor() {
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== Role.ADMIN && user.role !== Role.INSTRUCTOR)) {
    throw new Error("Unauthorized access. Admin or Instructor role required.");
  }
  return user;
}

/**
 * Fetch all upcoming and past events for the Admin/Instructor View.
 */
export async function getAdminEvents() {
  await verifyAdminOrInstructor();
  
  return await prisma.event.findMany({
    orderBy: {
      startTime: "desc"
    },
    include: {
      cohort: true,
      host: {
        select: {
          id: true,
          role: true,
          profile: true
        }
      },
      rsvps: {
        include: {
          user: {
            select: { id: true, email: true, role: true, profile: true }
          }
        }
      }
    }
  });
}

/**
 * Create a new Live Event
 */
export async function createEvent(data: {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: EventType;
  link?: string;
  cohortId?: string;
}) {
  const admin = await verifyAdminOrInstructor();

  const newEvent = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      type: data.type,
      link: data.link,
      cohortId: data.cohortId || null,
      hostId: admin.id
    }
  });

  revalidatePath("/admin/live-ops");
  revalidatePath("/calendar");
  
  return newEvent;
}

/**
 * Fetch calendar events specifically available to the actively logged-in student.
 */
export async function getStudentEvents() {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized access");

  // Students see events explicitly assigned to their cohort, OR global events (cohortId = null)
  return await prisma.event.findMany({
    where: {
      OR: [
        { cohortId: user.cohortId },
        { cohortId: null }
      ]
    },
    include: {
      cohort: true,
      host: {
        select: {
          id: true,
          role: true,
          profile: true
        }
      },
      rsvps: {
        where: {
          userId: user.id
        }
      }
    },
    orderBy: {
      startTime: "asc"
    }
  });
}

/**
 * Log or update a student's RSVP intent for a specific event
 */
export async function updateRSVP(eventId: string, status: RSVPStatus) {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized access");

  const rsvp = await prisma.eventRSVP.upsert({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId: eventId
      }
    },
    create: {
      userId: user.id,
      eventId: eventId,
      status: status
    },
    update: {
      status: status
    }
  });

  revalidatePath("/calendar");
  revalidatePath("/admin/live-ops");
  
  return rsvp;
}
