import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai'; // for embedding generation
import { getAuthenticatedUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const rawOpenAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { messages, lessonId } = await req.json();
    
    // We only embed the final message the user just sent to retrieve the most pertinent context 
    const lastMessage = messages[messages.length - 1].content;

    // 1. Generate Query Vector
    const embeddingRes = await rawOpenAi.embeddings.create({
      model: "text-embedding-3-small",
      input: lastMessage,
    });
    const queryVector = embeddingRes.data[0].embedding;

    // 2. Query Pinecone for top 3 closest curriculum chunks
    const index = pc.index('opensch');
    
    // Optional: If we want to strictly filter by lessonId, we could pass a filter here.
    // However, it's generally better to allow global syllabus search so the AI can reference past concepts.
    const queryResponse = await index.query({
      vector: queryVector,
      topK: 3,
      includeMetadata: true,
    });

    const contextChunks = queryResponse.matches
      .map(match => match.metadata?.contentSnippet || '')
      .join('\n\n--- NEXT CHUNK ---\n\n');

    // 3. Construct Context-Aware System Prompt
    const apiCurrentUser = await getAuthenticatedUser();
    let userExperienceContext = "";
    
    if (apiCurrentUser) {
      const profile = await prisma.profile.findUnique({ where: { userId: apiCurrentUser.id } });
      if (profile?.experienceLevel) {
        userExperienceContext = `\n\nSTUDENT BUILDER PROFILE:\nThe user's AI builder experience level is "${profile.experienceLevel}". Tailor the complexity of your workflow guidance to match this specific experience level exactly.`;
      }
    }

    const systemPrompt = `You are the elite OpenSch AI Teaching Assistant.
You are helping an OpenSch student who is currently learning in the Academy.
Here is the most relevant contextual information retrieved from our official syllabus regarding their question:

${contextChunks}${userExperienceContext}

CRITICAL PEDAGOGY INSTRUCTIONS:
1. YOU ARE A WORKFLOW COACH, NOT A CODE GENERATOR. You are teaching students how to become AI-native engineers.
2. NEVER WRITE FULL CODE BLOCKS. You must never write more than 3-4 lines of code in a single response. Do not give them the code they asked for.
3. TEACH THE TOOLS: When a student asks how to build something, explain the architectural concept briefly, and then give them the EXACT PROMPT they should paste into Cursor, Claude, or GitHub Copilot to build it.
   - Example format: "To build this, open \`[filename]\` in your IDE and use this prompt: *"Build a responsive Navigation component using TailwindCSS that includes..."*
4. DEBUGGING: If they paste an error, tell them exactly what to highlight in their IDE and what prompt to use to let their own AI tools fix it (e.g., "Highlight lines 40-50 and use CMD+K with the prompt: 'This is throwing an undefined error, refactor it to safely handle the null state'").
5. Be concise, highly technical, and direct. Absolutely NO creative writing or pleasantries. Always answer the question strictly using the provided syllabus context whenever possible before falling back on general React/Next.js knowledge.`;

    // 4. Stream response via Vercel AI SDK
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages,
      temperature: 0.3, // Keeps the AI grounded and deterministic
      onFinish: async ({ text }) => {
        try {
          const currentUser = await getAuthenticatedUser();
          if (currentUser) {
            // Find or create a global copilot session for the user
            let session = await prisma.copilotSession.findFirst({
              where: { userId: currentUser.id },
              orderBy: { createdAt: 'desc' }
            });

            if (!session) {
              session = await prisma.copilotSession.create({
                data: {
                  userId: currentUser.id,
                  title: "OpenSch Intelligence Session"
                }
              });
            }

            // Save the user's last message
            await prisma.copilotMessage.create({
              data: {
                sessionId: session.id,
                role: 'user',
                content: lastMessage,
              }
            });

            // Save the AI's response
            await prisma.copilotMessage.create({
              data: {
                sessionId: session.id,
                role: 'assistant',
                content: text,
              }
            });
          }
        } catch (dbError) {
          console.error("Failed to save chat history to Prisma:", dbError);
        }
      }
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error('RAG Copilot Pipeline Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
