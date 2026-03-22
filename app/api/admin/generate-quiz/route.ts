import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

const GenerateQuizSchema = z.object({
  lessonId: z.string().uuid({ message: "Invalid Lesson ID format" }),
});

const QuizQuestionSchema = z.object({
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.string()),
    correctIndex: z.number(),
    videoTimestamp: z.number().describe("The timestamp in seconds where the answer to this question appears in the video transcript.")
  }))
});

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role === 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const validatedFields = GenerateQuizSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Validation failed', details: validatedFields.error.flatten() }, { status: 400 });
    }

    const { lessonId } = validatedFields.data;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { transcriptCleanText: true, transcriptSegments: true }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 });
    }

    if (!lesson.transcriptCleanText || !lesson.transcriptSegments) {
      return NextResponse.json({ error: 'Lesson does not have a transcript to generate questions from. Please upload a video and wait for transcription to finish first.' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Provide the segments with their timestamps so the AI can figure out the `videoTimestamp` accurately.
    const transcriptWithTimestamps = (lesson.transcriptSegments as any[]).map(seg => `[${seg.start}s - ${seg.end}s]: ${seg.text}`).join('\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content: `You are an expert instructional designer. Generate 10 multiple-choice questions based on the provided video transcription. 
Each question must test a distinct, specific concept taught in the video.
The 'videoTimestamp' MUST be accurate based on the timestamp brackets provided in the text. Provide the exact second (e.g., 145) where the concept starts being discussed.`
        },
        {
          role: 'user',
          content: transcriptWithTimestamps
        }
      ],
      response_format: zodResponseFormat(QuizQuestionSchema, "quiz"),
    });

    const rawContent = completion.choices[0].message.content;
    if (!rawContent) {
      return NextResponse.json({ error: 'Failed to generate quiz data.' }, { status: 500 });
    }
    
    const parsedData = JSON.parse(rawContent);

    // Give each question a unique ID using a prefix and a counter
    const generatedQuestions = parsedData.questions.map((q: any, idx: number) => ({
      ...q,
      id: `q-auto-${Date.now()}-${idx}`
    }));

    return NextResponse.json(generatedQuestions);

  } catch (error: any) {
    console.error('Quiz Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during quiz generation.' },
      { status: 500 }
    );
  }
}
