import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getAuthenticatedUser } from '@/lib/auth';

// Rate limiter setup using Upstash
// Only initialize if environment variables are present to avoid crashing in dev
const ratelimit = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '5 m'),
      analytics: true,
    }) 
  : null;

// Zod Schema for strict input validation
const GradeSchema = z.object({
  // Relaxes .url() since frontend sends 'github.com/...'
  repoUrl: z.string().max(200, "URL is too long"),
  sprintContext: z.string().min(3).max(500, "Sprint context too long"),
  studentName: z.string().max(100, "Student name too long").optional(),
  submissionId: z.string().uuid("Invalid submission ID"),
});



export const maxDuration = 60; // 1 min timeout for grading

export async function POST(req: Request) {
  // Initialize OpenAI client dynamically at runtime
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Security Block: RBAC Auth Check
  const user = await getAuthenticatedUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized access. Only Instructors can trigger AI Grading.' }, { status: 403 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured in the environment variables.' },
      { status: 500 }
    );
  }

  try {
    // 1. Rate Limiting Check (if configured)
    const ip = req.headers.get('x-forwarded-for') ?? user.id;
    
    if (ratelimit) {
      const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_grade_${ip}`);
      
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

    // 2. Strict Zod Input Validation
    const rawBody = await req.json();
    const validatedBody = GradeSchema.safeParse(rawBody);

    if (!validatedBody.success) {
      return NextResponse.json({ 
        error: 'Input validation failed', 
        details: validatedBody.error.flatten() 
      }, { status: 400 });
    }

    const { repoUrl, sprintContext, studentName, submissionId } = validatedBody.data;

    console.log(`Starting AI Grading for ${studentName || 'Student'} on ${sprintContext} (${repoUrl})`);

    // --- 1. PARSE GITHUB URL ---
    // Example: github.com/edohoeketio-lgtm/Opensch or https://github.com/edohoeketio-lgtm/Opensch
    const cleanUrl = repoUrl.replace(/^https?:\/\//, '').replace(/^www\./, '');
    const parts = cleanUrl.split('/');
    if (parts[0] !== 'github.com' || parts.length < 3) {
      throw new Error("Invalid GitHub URL format. Expected github.com/owner/repo");
    }
    const owner = parts[1];
    const repo = parts[2].replace(/\.git$/, '');

    let codebaseContext = '';

    // --- 2. FETCH REPOSITORY TREE ---
    console.log(`Fetching repository tree for ${owner}/${repo}...`);
    
    const githubHeaders: any = { 
        'Accept': 'application/vnd.github.v3+json', 
        'User-Agent': 'OpenSch-AI-Grader' 
    };
    
    if (process.env.GITHUB_TOKEN) {
        githubHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    
    const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: githubHeaders
    });
    
    if (!repoInfoRes.ok) {
        throw new Error(`Failed to fetch repository info. Status: ${repoInfoRes.status}`);
    }
    const repoInfo = await repoInfoRes.json();
    const defaultBranch = repoInfo.default_branch;

    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, {
        headers: githubHeaders
    });

    if (!treeRes.ok) {
        throw new Error(`Failed to fetch repository tree. Status: ${treeRes.status}`);
    }
    const treeData = await treeRes.json();

    // --- 3. FILTER & COMPILE SOURCE CODE ---
    const EXCLUDED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.mp4', '.pdf', '.zip', '.tar.gz', '.woff', '.woff2', '.ttf'];
    const EXCLUDED_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'public'];
    
    const relevantFiles = treeData.tree.filter((node: any) => {
        if (node.type !== 'blob') return false;
        const pathSegments = node.path.split('/');
        if (pathSegments.some((seg: string) => EXCLUDED_DIRS.includes(seg))) return false;
        if (node.path === 'package-lock.json' || node.path === 'yarn.lock' || node.path === 'pnpm-lock.yaml') return false;
        const ext = node.path.substring(node.path.lastIndexOf('.')).toLowerCase();
        if (EXCLUDED_EXTENSIONS.includes(ext)) return false;
        return true;
    });

    console.log(`Found ${relevantFiles.length} relevant source files. Fetching contents...`);
    const topFiles = relevantFiles.slice(0, 15);

    for (const file of topFiles) {
        try {
            const fileRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${file.path}`, {
                headers: githubHeaders
            });
            if (fileRes.ok) {
                const content = await fileRes.text();
                codebaseContext += `\n\n--- FILE: ${file.path} ---\n\`\`\`\n${content}\n\`\`\`\n`;
            }
        } catch {
            console.warn(`Failed to fetch content for ${file.path}`);
        }
    }

    if (codebaseContext.length === 0) {
        throw new Error("Could not extract any readable code from the repository.");
    }

    // Truncate context if it's ridiculously huge (rough heuristic)
    if (codebaseContext.length > 100000) {
        codebaseContext = codebaseContext.substring(0, 100000) + '\n\n...[TRUNCATED FOR LENGTH]...';
    }

    console.log(`Compiled ${codebaseContext.length} characters of codebase context. Calling OpenAI...`);

    // --- 4. CALL OPENAI WITH ACTUAL CODE ---
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a Senior Engineering Instructor at an elite tech academy called OpenSch. You are reviewing a student's actual GitHub repository submission.
          
          You must respond in strict JSON format with the following schema:
          {
            "totalScore": <number between 0-100>,
            "confidenceScore": <number between 0-100 representing how confident you are in this analysis given the provided code context>,
            "archQuality": <string: "Pass", "Fail", or "Needs Work">,
            "securityFlags": <number of potential security vulnerabilities found>,
            "analysis": <string: a concise 2-3 sentence technical analysis of the ACTUAL codebase files provided>,
            "primaryEntrypoints": [
              { "file": <filename from the files provided>, "note": <brief technical note>, "type": <"code" | "config" | "error"> }
            ],
            "feedback": <string: a comprehensive 2-3 paragraph personalized feedback letter addressing the student by name, citing SPECIFIC lines of code or architectural decisions you saw in their files>
          }`
        },
        {
          role: 'user',
          content: `Grade this student submission:
          Student Name: ${studentName || 'Student'}
          Sprint Context: ${sprintContext}
          Repository URL: ${repoUrl}
          
          Here are the actual contents of their repository:
          ${codebaseContext}
          
          Generate a realistic, slightly critical but highly constructive grading payload based STRICTLY on the code provided above.`
        }
      ],
      temperature: 0.2, // Lower temperature since we have real code to evaluate
    });

    const aiResponse = completion.choices[0].message.content;
    
    if (!aiResponse) {
        throw new Error("Failed to generate AI grading response.");
    }

    const payload = JSON.parse(aiResponse);
    console.log('AI Grading successful. Updating database...');

    // Dynamic import for prisma to avoid top-level await edge cases on Vercel sometimes
    const { default: prisma } = await import('@/lib/prisma');
    
    // Save generated AI data to the Database and mark as AI_DRAFTED
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        aiScore: payload.totalScore,
        aiConfidenceScore: payload.confidenceScore !== undefined ? payload.confidenceScore : payload.totalScore,
        aiRationale: payload.analysis,
        aiPrimaryEntrypoints: payload.primaryEntrypoints,
        feedback: payload.feedback,
        status: 'AI_DRAFTED',
        aiDraftedAt: new Date()
      }
    });

    return NextResponse.json(payload);

  } catch (error: any) {
    console.error('AI Grading Pipeline Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during the AI grading pipeline.' },
      { status: 500 }
    );
  }
}
