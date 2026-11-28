import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/server';
import { getCleanTranscript } from '@/utils/transcript';

// Sliding-window IP rate limiter to protect API quota against automated bot abuse
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 25; // 25 generations per 10 min window per IP

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) {
    return false;
  }
  record.count += 1;
  return true;
}

function extractVideoId(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();

  // If already pure 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    
    // Strict domain whitelist prevents SSRF to internal/unrelated networks
    const validHosts = ['youtube.com', 'm.youtube.com', 'youtu.be', 'music.youtube.com'];
    if (!validHosts.includes(host)) {
      return null;
    }

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    const v = parsed.searchParams.get('v');
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

    const pathMatch = parsed.pathname.match(/\/(?:embed|v|shorts)\/([a-zA-Z0-9_-]{11})/);
    if (pathMatch) return pathMatch[1];
  } catch {
    const match = trimmed.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }
  return null;
}

function safeParseJSON(raw: string) {
  try {
    // Strip markdown fences if present
    let cleaned = raw.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      cleaned = cleaned.substring(start, end + 1);
    }
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    // Rate limit check based on client IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous';
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a few minutes before generating more content.' }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const rawUrl = typeof body.url === 'string' ? body.url.slice(0, 500) : '';
    const rawVoice = typeof body.voiceSample === 'string' ? body.voiceSample.slice(0, 4000) : '';

    if (!rawUrl) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    const videoId = extractVideoId(rawUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube link. Please paste a standard YouTube video URL.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Server AI configuration is missing.' }, { status: 500 });
    }

    // Optional user authentication (allows guest demo for portfolio reviewers)
    let user = null;
    let supabase = null;
    try {
      supabase = await createClient();
      const authRes = await supabase.auth.getUser();
      user = authRes.data?.user || null;
    } catch {
      user = null;
    }

    // If logged in, enforce user tier limits
    if (user && supabase) {
      const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single();
      const tier = profile?.tier || 'free';

      let query = supabase.from('content_packs').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      let limit = 3;
      const now = new Date();

      if (tier === 'basic') {
        limit = 5;
        const dayOfWeek = now.getUTCDay();
        const diffToMonday = now.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const startOfWeekUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diffToMonday)).toISOString();
        query = query.gte('created_at', startOfWeekUTC);
      } else if (tier === 'pro') {
        limit = 10;
        const startOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
        query = query.gte('created_at', startOfDayUTC);
      } else if (tier === 'unlimited') {
        limit = Infinity;
      }

      const { count } = await query;
      if (count !== null && count >= limit) {
        return NextResponse.json({ error: `You have reached your limit for the ${tier} tier. Please upgrade to generate more.` }, { status: 403 });
      }
    }

    // 1. Fetch transcript using multiple fallback strategies
    let fullTranscript = '';
    try {
      fullTranscript = await getCleanTranscript(videoId);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to extract transcript.';
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // 2. Initialize Gemini API with robust model fallback cascade
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
      'gemini-flash-latest'
    ];

    const truncatedTranscript = fullTranscript.slice(0, 18000);

    let prompt = `You are an elite editorial ghostwriter and content repurposing strategist. 
Convert the following spoken YouTube video transcript into a publication-ready Content Pack consisting of 4 distinct assets.

---
RAW VIDEO TRANSCRIPT:
${truncatedTranscript}
---
`;

    if (rawVoice && rawVoice.trim().length > 0) {
      prompt += `
---
DESIRED VOICE, TONE & VOCABULARY GUIDELINES:
${rawVoice}
---
Strictly adopt the rhythm, vocabulary level, sentence variety, and tone described above. Avoid generic corporate clichés.`;
    }

    prompt += `

OUTPUT REQUIREMENTS:
Output a single valid JSON object with EXACTLY this structure (do NOT enclose in code fences, output raw JSON only):
{
  "blogPost": "A publication-grade Markdown essay with an irresistible title (#), H2 sections (##), key bullet takeaways, and zero generic filler words.",
  "linkedinPost": "A high-engagement professional LinkedIn post with a strong curiosity hook, line-break spacing, actionable insights, and a conversation-starter question.",
  "tweets": [
    "Hook tweet that creates tension or challenges conventional wisdom...",
    "Deep-dive supporting point with concrete details or numbers...",
    "Takeaway / conclusion tweet with actionable summary..."
  ],
  "shortScript": "A 60-second video script for Reels/TikTok with bracketed visual cues like [Talking Head: Punch Zoom], [B-Roll: Code Editor], [Text On Screen], fast pacing, and a crisp opening hook."
}`;

    let resultText = '';
    let lastError: Error | null = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        resultText = result.response.text();
        if (resultText && resultText.length > 50) {
          break; // Succeeded
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini] Model ${modelName} failed, trying next fallback:`, err.message);
      }
    }

    if (!resultText) {
      throw lastError || new Error('All AI model attempts timed out. Please try again.');
    }

    const contentPack = safeParseJSON(resultText);
    if (!contentPack || typeof contentPack !== 'object') {
      return NextResponse.json({ error: 'AI returned invalid output structure. Please retry.' }, { status: 500 });
    }

    // Normalize output structure ensuring all fields are valid
    const normalized = {
      blogPost: typeof contentPack.blogPost === 'string' ? contentPack.blogPost : 'Content generated successfully.',
      linkedinPost: typeof contentPack.linkedinPost === 'string' ? contentPack.linkedinPost : '',
      tweets: Array.isArray(contentPack.tweets) ? contentPack.tweets.map(String) : [],
      shortScript: typeof contentPack.shortScript === 'string' ? contentPack.shortScript : ''
    };

    // If logged in, save to Supabase
    if (user && supabase) {
      try {
        await supabase.from('content_packs').insert({
          user_id: user.id,
          youtube_url: rawUrl,
          blog_post: normalized.blogPost,
          linkedin_post: normalized.linkedinPost,
          tweets: normalized.tweets,
          short_script: normalized.shortScript,
        });
      } catch (dbErr) {
        console.error('Database save error (non-fatal):', dbErr);
      }
    }

    return NextResponse.json(normalized);

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error generating content:', error);
      return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
