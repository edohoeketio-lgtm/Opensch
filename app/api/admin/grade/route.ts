import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 60; // 1 min timeout for grading

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured in the environment variables.' },
      { status: 500 }
    );
  }

  try {
    const { repoUrl, sprintContext, studentName } = await req.json();

    if (!repoUrl || !sprintContext) {
      return NextResponse.json({ error: 'Missing required parameters: repoUrl and sprintContext.' }, { status: 400 });
    }

    console.log(`Starting AI Grading for ${studentName} on ${sprintContext} (${repoUrl})`);

    // --- 1. PARSE GITHUB URL ---
    // Example: github.com/edohoeketio-lgtm/Opensch or https://github.com/edohoeketio-lgtm/Opensch
    let cleanUrl = repoUrl.replace(/^https?:\/\//, '').replace(/^www\./, '');
    const parts = cleanUrl.split('/');
    if (parts[0] !== 'github.com' || parts.length < 3) {
      throw new Error("Invalid GitHub URL format. Expected github.com/owner/repo");
    }
    const owner = parts[1];
    const repo = parts[2].replace(/\.git$/, '');

    // --- 2. FETCH REPOSITORY TREE ---
    console.log(`Fetching repository tree for ${owner}/${repo}...`);
    
    // Get the default branch (usually main or master)
    const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'OpenSch-AI-Grader' }
    });
    
    if (!repoInfoRes.ok) {
        throw new Error(`Failed to fetch repository info. Status: ${repoInfoRes.status}`);
    }
    const repoInfo = await repoInfoRes.json();
    const defaultBranch = repoInfo.default_branch;

    // Fetch the tree recursively
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, {
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'OpenSch-AI-Grader' }
    });

    if (!treeRes.ok) {
        throw new Error(`Failed to fetch repository tree. Status: ${treeRes.status}`);
    }
    const treeData = await treeRes.json();

    // --- 3. FILTER & COMPILE SOURCE CODE ---
    // We want to avoid binaries, giant lock files, images, and standard node_modules.
    const EXCLUDED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.mp4', '.pdf', '.zip', '.tar.gz', '.woff', '.woff2', '.ttf'];
    const EXCLUDED_DIRS = ['node_modules', '.git', '.next', 'dist', 'build', 'public'];
    
    const relevantFiles = treeData.tree.filter((node: any) => {
        if (node.type !== 'blob') return false;
        
        const pathSegments = node.path.split('/');
        // Check if any segment is a blacklisted directory
        if (pathSegments.some((seg: string) => EXCLUDED_DIRS.includes(seg))) return false;
        
        // Exclude specific gigantic files
        if (node.path === 'package-lock.json' || node.path === 'yarn.lock' || node.path === 'pnpm-lock.yaml') return false;
        
        const ext = node.path.substring(node.path.lastIndexOf('.')).toLowerCase();
        if (EXCLUDED_EXTENSIONS.includes(ext)) return false;

        return true;
    });

    console.log(`Found ${relevantFiles.length} relevant source files. Fetching contents... (Limiting to top 15 for API speed/context limits)`);

    // Limit to the most crucial files to avoid blowing up the context window for massive monorepos.
    // In production, we'd use a smarter RAG approach or map-reduce parsing.
    const topFiles = relevantFiles.slice(0, 15);
    let codebaseContext = '';

    for (const file of topFiles) {
        try {
            const fileRes = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${file.path}`);
            if (fileRes.ok) {
                const content = await fileRes.text();
                codebaseContext += `\n\n--- FILE: ${file.path} ---\n\`\`\`\n${content}\n\`\`\`\n`;
            }
        } catch (e) {
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
    console.log('AI Grading successful.');

    return NextResponse.json(payload);

  } catch (error: any) {
    console.error('AI Grading Pipeline Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during the AI grading pipeline.' },
      { status: 500 }
    );
  }
}
