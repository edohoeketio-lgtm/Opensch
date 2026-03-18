"use server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth";
import { ApplicationStatus, PaymentStatus, Role } from "@prisma/client";
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
 * Fetch all applications for the admin dashboard.
 */
export async function getApplications() {
  await verifyAdminOrInstructor();
  
  return await prisma.application.findMany({
    orderBy: {
      appliedAt: "desc"
    },
    include: {
      reviewer: {
        include: {
          profile: true
        }
      }
    }
  });
}

/**
 * Update the status of an application in the pipeline.
 */
export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const user = await verifyAdminOrInstructor();

  const app = await prisma.application.update({
    where: { id },
    data: { 
      status,
      reviewerId: user.id 
    }
  });

  revalidatePath("/admin/admissions");
  return app;
}

/**
 * Update the payment status of an application.
 */
export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
  await verifyAdminOrInstructor();

  const app = await prisma.application.update({
    where: { id },
    data: { paymentStatus }
  });

  revalidatePath("/admin/admissions");
  return app;
}

/**
 * Converts a fully paid/accepted application into a Student User.
 */
export async function convertApplicationToStudent(id: string, cohortId?: string) {
  const admin = await verifyAdminOrInstructor();

  const application = await prisma.application.findUnique({
    where: { id }
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  if (application.status === ApplicationStatus.ENROLLED) {
    throw new Error("Applicant is already a student.");
  }

  // Check if a user with this email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: application.email }
  });

  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  // Create the new User and Profile natively inside a transaction
  const result = await prisma.$transaction(async (tx: any) => {
    const newUser = await tx.user.create({
      data: {
        email: application.email,
        role: Role.STUDENT,
        cohortId: cohortId || null,
        profile: {
          create: {
            fullName: `${application.firstName} ${application.lastName}`.trim(),
            experienceLevel: application.experience,
            motivation: application.motivation,
            linkedinUrl: application.linkedinUrl
          }
        }
      }
    });

    // Mark the application as Enrolled
    const updatedApp = await tx.application.update({
      where: { id },
      data: { 
        status: ApplicationStatus.ENROLLED,
        reviewerId: admin.id
      }
    });

    return { newUser, updatedApp };
  });

  revalidatePath("/admin/admissions");
  revalidatePath("/admin/roster");
  
  return result;
}
