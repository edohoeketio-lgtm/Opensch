import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

const execAsync = promisify(exec);

// Rate limiter: 5 requests per 10 minutes (transcription is expensive)
let ratelimit: Ratelimit | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '10 m'),
      analytics: true,
    });
  }
} catch (e) {
  // Ignore
}

// Zod Schema for validation
const TranscribeSchema = z.object({
  lessonId: z.string().uuid({ message: "Invalid Lesson ID format" }),
});



// Set a longer timeout for the API route if the video file is large
export const maxDuration = 120; // 2 minutes

export async function POST(req: Request) {
  // Initialize OpenAI client dynamically at runtime
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured in the environment variables.' },
      { status: 500 }
    );
  }

  try {
    // 1. Rate Limiting Check
    if (ratelimit) {
      const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
      const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_transcribe_${ip}`);
      
      if (!success) {
        return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          }
        });
      }
    }

    // 2. Parse Query Parameters Stream
    const url = new URL(req.url);
    const lessonIdRaw = url.searchParams.get('lessonId');
    const fileName = url.searchParams.get('fileName') || 'upload.mp4';

    const validatedFields = TranscribeSchema.safeParse({
      lessonId: lessonIdRaw,
    });

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Validation failed', details: validatedFields.error.flatten() }, { status: 400 });
    }

    const { lessonId } = validatedFields.data;

    // Verify Lesson exists before deep processing
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 });
    }

    if (!req.body) {
      return NextResponse.json({ error: 'No video stream provided.' }, { status: 400 });
    }

    console.log(`Starting transcription for Lesson ${lessonId}, file: ${fileName}`);

    // --- AUDIO COMPRESSION PASS ---
    // OpenAI Whisper has a strict 25MB limit. We extract the audio locally to a tiny MP3 first.
    const tempVideoPath = path.join(os.tmpdir(), `upload-${Date.now()}.mp4`);
    const tempAudioPath = path.join(os.tmpdir(), `audio-${Date.now()}.mp3`);
    
    // Convert Web Fetch ReadableStream to Node WritableStream directly without memory buffering
    const fileStream = fs.createWriteStream(tempVideoPath);
    const readable = Readable.fromWeb(req.body as import('stream/web').ReadableStream);
    
    readable.pipe(fileStream);
    await finished(fileStream);

    console.log('Extracting and compressing audio via ffmpeg...');
    // Extract 32kbps mono audio
    const ffmpegPath = path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg');
    await execAsync(`"${ffmpegPath}" -i "${tempVideoPath}" -vn -acodec libmp3lame -ac 1 -ab 32k "${tempAudioPath}"`);
    console.log('Audio compression complete.');

    // Step 1: Extract Audio Transcript using OpenAI Whisper
    const audioStream = fs.createReadStream(tempAudioPath);
    
    console.log('Sending compressed audio to OpenAI Whisper...');
    const transcription = await openai.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['segment'], // To get timestamp markers for the UI
    });

    console.log('Whisper transcription successful.');

    // Clean up temporary files immediately
    try {
      fs.unlinkSync(tempVideoPath);
      fs.unlinkSync(tempAudioPath);
    } catch (cleanupError) {
      console.error('Failed to clean up temp files', cleanupError);
    }

    // Step 2: Cleanup and Formatting via GPT-4o-mini
    console.log('Starting cleanup pass via GPT-4o-mini...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert technical editor reviewing a raw educational video transcript.
          Your task is to:
          1. Clean up "ums", "ahs", and obvious false starts.
          2. Format the transcription into readable, cleanly separated paragraphs.
          3. Ensure developer terms and technical jargon (e.g., "Next.js", "OAuth", "API") are capitalized correctly.
          4. DO NOT summarize the content. Preserve the exact teaching material and instructions. Just make it highly readable.`
        },
        {
          role: 'user',
          content: transcription.text
        }
      ],
      temperature: 0.1, // Keep it highly deterministic and close to the original
    });

    const cleanedTranscript = completion.choices[0].message.content;
    console.log('GPT-4o-mini cleanup successful.');

    const payload = {
        segments: transcription.segments,
        rawText: transcription.text,
        cleanedText: cleanedTranscript 
    };

    // Save directly to Prisma Database to prevent Serverless ephemeral file system data loss
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        transcriptRawText: payload.rawText,
        transcriptCleanText: payload.cleanedText,
        transcriptSegments: payload.segments as any,
      }
    });

    console.log(`Successfully saved transcript to Prisma for Lesson: ${lessonId}`);

    // Return the payload for immediate UI hydration if needed
    return NextResponse.json(payload);

  } catch (error: any) {
    console.error('Transcription Pipeline Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during the transcription pipeline.' },
      { status: 500 }
    );
  }
}
