import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Ensure the Edge runtime is used for streaming
export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, transcript } = await req.json();

    if (!messages || !transcript) {
      return NextResponse.json({ error: 'Messages and transcript are required' }, { status: 400 });
    }

    const systemPrompt = `You are OpenSch Intelligence, an elite AI-native assistant for the OpenSch learning platform.
You are helping a student who is currently watching a video lesson.
Here is the exact transcript of the video lesson they are watching:

--- START TRANSCRIPT ---
${transcript}
--- END TRANSCRIPT ---

Your job is to answer the student's questions based strictly on the transcript provided above. 
If the student asks something not covered in the transcript, politely explain that it isn't covered in this specific lesson, but do your best to help them using your general knowledge while keeping the focus on the lesson's context.
Be concise, highly technical, and use the same premium, direct tone as the OpenSch platform. Use markdown for code blocks.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.3, // Keep responses grounded and precise
    });

    // Create a readable stream from the OpenAI response
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: any) {
    console.error('OpenSch Intelligence API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during the OpenSch Intelligence request.' },
      { status: 500 }
    );
  }
}
