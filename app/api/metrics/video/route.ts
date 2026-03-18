import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { z } from "zod";

const VideoMetricsSchema = z.object({
  videoId: z.string().uuid("Invalid video ID format"),
  maxWatchedSeconds: z.number().nonnegative("Watched seconds cannot be negative"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedBody = VideoMetricsSchema.safeParse(body);

    if (!validatedBody.success) {
      return NextResponse.json(
        { error: "Input validation failed", details: validatedBody.error.flatten() },
        { status: 400 }
      );
    }

    const { videoId, maxWatchedSeconds } = validatedBody.data;

    // Mock tracking for local dev without a real DB
    console.log(`[Telemetry] User ${userId} watched ${videoId} up to ${maxWatchedSeconds}s`);

    return NextResponse.json({ success: true, progress: { maxWatchedSeconds } }, { status: 200 });
  } catch (error: any) {
    console.error("Video Metrics Error:", error);
    return NextResponse.json(
      { error: "Failed to securely record video metrics telemetry." },
      { status: 500 }
    );
  }
}
