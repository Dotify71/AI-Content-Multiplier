import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/server';
import { getCleanTranscript } from '@/utils/transcript';

function extractVideoId(url: string): string | null {
  try {
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (longMatch) return longMatch[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  } catch { }
  return null;
}

export async function POST(req: Request) {
  try {
    const { url, voiceSample } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube link. Please paste a standard YouTube video URL.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 });
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

    // If logged in, check quota limits
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

    // 2. Initialize Gemini API with robust model fallbacks
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
      'gemini-flash-latest'
    ];

    // Truncate to reasonable token length (~18,000 characters to keep generation lightning-fast)
    const truncatedTranscript = fullTranscript.slice(0, 18000);

    let prompt = `You are an elite editorial ghostwriter and content repurposing strategist. 
Convert the following spoken YouTube video transcript into a publication-ready Content Pack consisting of 4 distinct assets.

---
RAW VIDEO TRANSCRIPT:
${truncatedTranscript}
---
`;

    if (voiceSample && voiceSample.trim().length > 0) {
      prompt += `
---
DESIRED VOICE, TONE & VOCABULARY GUIDELINES:
${voiceSample}
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
  "shortScript": "A 60-second video script for Reels/TikTok with bracketed visual cues like [Talking Head - Punch Zoom], [B-Roll: Code Editor], [Text On Screen], fast pacing, and a crisp opening hook."
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

    // Parse clean JSON
    let contentPack;
    try {
      const jsonStart = resultText.indexOf('{');
      const jsonEnd = resultText.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON brackets found in response');
      }
      const cleanJson = resultText.substring(jsonStart, jsonEnd + 1);
      contentPack = JSON.parse(cleanJson);
    } catch {
      console.error('Failed to parse JSON:', resultText);
      return NextResponse.json({ error: 'AI returned invalid output structure. Please retry.' }, { status: 500 });
    }

    // If logged in, save to database
    if (user && supabase) {
      try {
        await supabase.from('content_packs').insert({
          user_id: user.id,
          youtube_url: url,
          blog_post: contentPack.blogPost,
          linkedin_post: contentPack.linkedinPost,
          tweets: contentPack.tweets,
          short_script: contentPack.shortScript,
        });
      } catch (dbErr) {
        console.error('Database save error (non-fatal):', dbErr);
      }
    }

    return NextResponse.json(contentPack);

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error generating content:', error);
      return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
