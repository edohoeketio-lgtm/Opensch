import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { CURRICULUM_WEEKS } from '../lib/content';

const apiKey = process.env.PINECONE_API_KEY!;
const openAiKey = process.env.OPENAI_API_KEY!;

if (!apiKey || !openAiKey) {
  throw new Error("Missing PINECONE_API_KEY or OPENAI_API_KEY in the environment.");
}

const pc = new Pinecone({ apiKey });
const openai = new OpenAI({ apiKey: openAiKey });

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  const index = pc.index('opensch');

  console.log("Starting curriculum ingestion...");

  let vectors: any[] = [];
  let totalProcessed = 0;
  
  for (const week of CURRICULUM_WEEKS) {
    for (const [moduleIndex, mod] of week.modules.entries()) {
      const moduleId = slugify(mod.title);

      for (const [lessonIndex, lesson] of mod.lessons.entries()) {
        const lessonId = slugify(lesson.title);
        
        // Build a rich text context block to generate the semantic vector embedding
        const textChunk = `Course: OpenSch Core Curriculum
Week ${week.number}: ${week.title} (${week.pillar})
Weekly Goal: ${week.goal}
Module: ${mod.title}
Lesson: ${lesson.title}

Context: In this lesson, students learn about ${lesson.title} under the topic of ${mod.title}. This is part of Week ${week.number} focusing on ${week.pillar} (${week.title}). 
If a student asks a question about ${lesson.title}, they are currently learning this concept.`;

        console.log(`Generating Embedding for lesson: ${lesson.title}`);
        
        const response = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: textChunk,
        });

        const embedding = response.data[0].embedding;

        vectors.push({
          // Create a unique deterministic ID
          id: `lesson-${lessonId}`,
          values: embedding,
          metadata: {
            courseId: 'opensch-core',
            moduleId: moduleId,
            lessonId: lessonId,
            moduleTitle: mod.title,
            lessonTitle: lesson.title,
            weekNumber: week.number,
            type: 'lesson',
            contentSnippet: textChunk 
          }
        });
        totalProcessed++;
      }
    }
  }

  // Pinecone recommends chunking massive datasets. We will iterate in batches of 100.
  console.log(`\nFound ${vectors.length} curriculum modules/lessons. Upserting to Pinecone database...`);
  
  const batchSize = 100;
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    console.log(`Attempting to upsert batch of size: ${batch.length}`);
    if (batch.length > 0) {
      await index.upsert({ records: batch });
    }
  }
  
  console.log(`✅ Semantic Ingestion complete! The OpenSch AI now understands ${totalProcessed} curriculum chunks.`);
}

main().catch(err => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
