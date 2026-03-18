import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAuthenticatedUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

// We execute this on Node runtime so @prisma/client works natively
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, transcript } = await req.json();
    const lastMessage = messages?.[messages.length - 1]?.content || "";

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
If the student asks something not covered in the transcript, you MUST politely refuse to answer and redirect them back to the lesson material. Do not use outside general knowledge. Under no circumstances should you engage in creative writing, write poems, or answer off-topic requests (e.g. "another one"). 

CRITICAL PEDAGOGY INSTRUCTIONS:
1. YOU ARE A WORKFLOW COACH, NOT A CODE GENERATOR. You are teaching students how to become AI-native engineers.
2. NEVER WRITE FULL CODE BLOCKS. You must never write more than 3-4 lines of code in a single response. Do not give them the code they asked for.
3. TEACH THE TOOLS: When a student asks how to build something, explain the architectural concept briefly, and then give them the EXACT PROMPT they should paste into Cursor, Claude, or GitHub Copilot to build it.
   - Example format: "To build this, open \`[filename]\` in your IDE and use this prompt: *"Build a responsive Navigation component using TailwindCSS that includes..."*
4. DEBUGGING: If they paste an error, tell them exactly what to highlight in their IDE and what prompt to use to let their own AI tools fix it.
5. Be concise and authoritative. Use the premium, direct tone of the OpenSch platform.`;

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
        let fullResponse = '';
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        
        try {
          const currentUser = await getAuthenticatedUser();
          if (currentUser) {
            let session = await prisma.copilotSession.findFirst({
              where: { userId: currentUser.id },
              orderBy: { createdAt: 'desc' }
            });

            if (!session) {
              session = await prisma.copilotSession.create({
                data: {
                  userId: currentUser.id,
                  title: "OpenSch Lesson Copilot"
                }
              });
            }

            await prisma.copilotMessage.create({
              data: {
                sessionId: session.id,
                role: 'user',
                content: lastMessage,
              }
            });

            await prisma.copilotMessage.create({
              data: {
                sessionId: session.id,
                role: 'assistant',
                content: fullResponse,
              }
            });
          }
        } catch (dbError) {
          console.error("Failed to save copilot history to Prisma:", dbError);
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
