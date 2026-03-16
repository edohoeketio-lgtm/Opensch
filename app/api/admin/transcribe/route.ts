import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

// Initialize OpenAI client
// Ensure OPENAI_API_KEY is set in your .env or Vercel environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set a longer timeout for the API route if the video file is large
export const maxDuration = 120; // 2 minutes

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured in the environment variables.' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No valid video or audio file provided.' }, { status: 400 });
    }

    console.log(`Starting transcription for file: ${(file as File).name} (${file.size} bytes)`);

    // --- AUDIO COMPRESSION PASS ---
    // OpenAI Whisper has a strict 25MB limit. We extract the audio locally to a tiny MP3 first.
    const tempVideoPath = path.join(os.tmpdir(), `upload-${Date.now()}.mp4`);
    const tempAudioPath = path.join(os.tmpdir(), `audio-${Date.now()}.mp3`);
    
    // Save incoming file to tmp disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(tempVideoPath, buffer);

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

    // Save it directly to the public folder so the UI can use it
    const filePath = path.join(process.cwd(), 'public', 'latest-transcript.json');
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
    console.log('Saved transcript to public/latest-transcript.json');

    // Return the full payload needed for the OpenSch Intelligence UI
    return NextResponse.json(payload);

  } catch (error: any) {
    console.error('Transcription Pipeline Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during the transcription pipeline.' },
      { status: 500 }
    );
  }
}
