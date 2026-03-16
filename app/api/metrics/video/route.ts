// @ts-nocheck
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { videoId, maxWatchedSeconds, userId } = body;

    if (!videoId || typeof maxWatchedSeconds !== "number" || !userId) {
      return NextResponse.json(
        { error: "Missing required fields (videoId, maxWatchedSeconds, userId)" },
        { status: 400 }
      );
    }

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
