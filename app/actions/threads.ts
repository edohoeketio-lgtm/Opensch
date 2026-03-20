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

export async function incrementThreadUpvote(threadId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) return { success: false, error: "Unauthorized" };

    await prisma.thread.update({
      where: { id: threadId },
      data: {
        upvotes: {
          increment: 1
        }
      }
    });

    revalidatePath("/feed");
    revalidatePath(`/feed/${threadId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to upvote thread:", error);
    return { success: false, error: "Failed to upvote" };
  }
}

export async function submitPollVote(threadId: string, optionIndex: number): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) return { success: false, error: "Unauthorized" };

    // Find the OP message which contains the original payload
    const opMessage = await prisma.message.findFirst({
      where: { threadId },
      orderBy: { createdAt: 'asc' }
    });

    if (!opMessage || !opMessage.payload) {
      return { success: false, error: "Poll not found" };
    }

    const payload: any = opMessage.payload;
    if (!payload.poll || !payload.poll.options || !payload.poll.options[optionIndex]) {
      return { success: false, error: "Invalid poll option" };
    }

    // Increment exactly the requested option
    payload.poll.options[optionIndex].votes = (payload.poll.options[optionIndex].votes || 0) + 1;

    await prisma.message.update({
      where: { id: opMessage.id },
      data: { payload }
    });

    revalidatePath("/feed");
    revalidatePath(`/feed/${threadId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to vote on poll:", error);
    return { success: false, error: "Failed to vote" };
  }
}

export async function reportThread(threadId: string, reason: string): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) return { success: false, error: "Unauthorized" };

    // Find thread author to report appropriately
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'asc' },
          include: { sender: true }
        }
      }
    });

    if (!thread) return { success: false, error: "Thread not found" };

    const opSender = thread.messages[0]?.sender;
    const authorName = (opSender as any)?.name || opSender?.email || "Unknown User";

    // Send a Notification to all Admins about this report
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    
    // Create notifications for all admins
    if (admins.length > 0) {
      const notifications = admins.map(admin => ({
        userId: admin.id,
        title: "Content Report Received",
        message: `${currentUser.email} reported a post originally authored by ${authorName}. Reason: ${reason}`,
        type: "alert",
        link: `/feed/${threadId}`
      }));
      
      await prisma.notification.createMany({
        data: notifications
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to report thread:", error);
    return { success: false, error: "Failed to submit report" };
  }
}

export async function deleteThread(threadId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) {
      return { success: false, error: "Unauthorized." };
    }

    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!thread) return { success: false, error: "Thread not found." };

    const isAuthor = thread.messages[0]?.senderId === currentUser.id;
    const isAdmin = currentUser.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      return { success: false, error: "Unauthorized. You do not have permission to delete this thread." };
    }

    await prisma.thread.delete({
      where: { id: threadId }
    });

    revalidatePath("/feed");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete thread:", error);
    return { success: false, error: "Failed to delete thread." };
  }
}

export async function deleteReply(messageId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getAuthenticatedUser();
    if (!currentUser) return { success: false, error: "Unauthorized." };

    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) return { success: false, error: "Reply not found." };

    const isAuthor = message.senderId === currentUser.id;
    const isAdmin = currentUser.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      return { success: false, error: "Unauthorized. You can only delete your own replies." };
    }

    await prisma.message.delete({
      where: { id: messageId }
    });

    revalidatePath(`/feed/${message.threadId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete reply:", error);
    return { success: false, error: "Failed to delete reply." };
  }
}
