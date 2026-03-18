"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "@/lib/auth";

const PollOptionSchema = z.object({
  text: z.string().min(1, "Poll option cannot be empty"),
  votes: z.number().default(0)
});

const PollSchema = z.object({
  question: z.string().min(5, "Poll question must be at least 5 characters long"),
  options: z.array(PollOptionSchema).min(2, "Poll must have at least 2 options")
});

const FeedPayloadSchema = z.object({
  image: z.string().url("Image must be a valid URL").optional(),
  video: z.string().url("Video must be a valid URL").optional(),
  codeSnippet: z.string().min(1, "Code snippet cannot be empty").optional(),
  repoUrl: z.string().url("Repository must be a valid URL").optional(),
  poll: PollSchema.optional()
});

const CreateThreadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  payload: FeedPayloadSchema.optional()
});

export type ThreadInput = z.infer<typeof CreateThreadSchema>;
export type ActionResponse = { success: true; threadId: string } | { success: false; errors?: Record<string, string[]>; error?: string };

export async function createFeedPost(data: ThreadInput): Promise<ActionResponse> {
  try {
    const validatedData = CreateThreadSchema.safeParse(data);

    if (!validatedData.success) {
      // Flatten the errors so we can return them nicely to the client
      const fieldErrors = validatedData.error.flatten().fieldErrors;
      return {
        success: false,
        errors: fieldErrors as Record<string, string[]>,
        error: "Validation failed"
      };
    }

    const { title, category, content, payload } = validatedData.data;

    // 1A (Security Constraint): Extract user directly from the secure Server Session
    // We do NOT trust any userId passed from the client payload.
    const currentUser = await getAuthenticatedUser();

    if (!currentUser) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // Security Constraint: Verify user permissions to post to this targetId
    // In a real app with Cohorts, we would verify `currentUser.cohortId === targetId`
    // For now, since they are posting to the Global 'CAMPUS', any student can post.


    // Insert Thread and initial Message in a transaction
    const thread = await prisma.thread.create({
      data: {
        title,
        category,
        targetType: "CAMPUS",
        messages: {
          create: {
            content,
            senderId: currentUser.id,
            payload: payload ? (payload as any) : undefined
          }
        }
      }
    });

    revalidatePath("/feed");

    return { success: true, threadId: thread.id };
  } catch (error: any) {
    console.error("Failed to post to feed:", error);
    
    if (error?.message?.includes("Can't reach database server") || error?.code === 'P1001') {
       return { success: false, error: "Database offline. Please start your Prisma Postgres server." };
    }
    
    return { success: false, error: error?.message || "An unexpected error occurred while posting." };
  }
}

const ReplySchema = z.object({
  threadId: z.string().uuid("Invalid thread ID"),
  content: z.string().min(1, "Reply cannot be empty")
});

export type ReplyInput = z.infer<typeof ReplySchema>;

export async function replyToThread(data: ReplyInput): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = ReplySchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, error: "Validation failed" };
    }

    const { threadId, content } = validatedData.data;

    const currentUser = await getAuthenticatedUser();
    if (!currentUser) return { success: false, error: "Unauthorized. Please log in." };

    await prisma.message.create({
      data: {
        content,
        threadId,
        senderId: currentUser.id
      }
    });

    revalidatePath(`/feed/${threadId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to post reply:", error);
    return { success: false, error: error?.message || "An unexpected error occurred." };
  }
}
